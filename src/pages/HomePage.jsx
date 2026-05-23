import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../components/feed/HeroSection';
import CategoryTabs from '../components/feed/CategoryTabs';
import TrendingSection from '../components/feed/TrendingSection';
import MasonryFeed from '../components/feed/MasonryFeed';
import PostModal from '../components/modals/PostModal';
import { postService } from '../services/postService';
import { pageTransition } from '../animations/variants';

export default function HomePage() {
  const { openUpload } = useOutletContext() || {};
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchFeed = useCallback(
    async (pageNum = 1, reset = false) => {
      setLoading(true);
      try {
        const { data } = await postService.getFeed({
          page: pageNum,
          limit: 24,
          category: category === 'all' ? undefined : category,
          sort: category === 'all' ? sort : 'latest',
        });
        const newPosts = data.data.posts;
        setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
        setHasMore(data.data.pagination.hasMore);
        setPage(pageNum);
      } catch {
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [category, sort]
  );

  useEffect(() => {
    fetchFeed(1, true);
  }, [fetchFeed]);

  useEffect(() => {
    const handler = () => fetchFeed(1, true);
    window.addEventListener('pinsphere:refresh-feed', handler);
    return () => window.removeEventListener('pinsphere:refresh-feed', handler);
  }, [fetchFeed]);

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" className="space-y-10">
      <HeroSection onUpload={openUpload} />
      <TrendingSection onOpenPost={setSelectedPost} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryTabs active={category} onChange={setCategory} />
        {category === 'all' && (
          <div className="flex rounded-full bg-gray-100 p-1 dark:bg-gray-800">
            {['latest', 'trending'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  sort === s
                    ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <MasonryFeed
        posts={posts}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => !loading && hasMore && fetchFeed(page + 1)}
        onOpenPost={setSelectedPost}
        emptyTitle="Loading inspiration..."
        emptyDescription="Curated pins are being prepared for you."
      />
      <PostModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
    </motion.div>
  );
}
