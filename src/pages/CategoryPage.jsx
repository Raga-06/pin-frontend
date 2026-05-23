import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import MasonryFeed from '../components/feed/MasonryFeed';
import PostModal from '../components/modals/PostModal';
import { postService } from '../services/postService';
import { getCategoryLabel } from '../utils/helpers';
import { CATEGORIES } from '../constants';
import { pageTransition } from '../animations/variants';

export default function CategoryPage() {
  const { slug } = useParams();
  const meta = CATEGORIES.find((c) => c.id === slug);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = useCallback(
    async (pageNum = 1, reset = false) => {
      setLoading(true);
      try {
        const { data } = await postService.getFeed({
          page: pageNum,
          limit: 24,
          category: slug,
          sort: 'trending',
        });
        setPosts((prev) => (reset ? data.data.posts : [...prev, ...data.data.posts]));
        setHasMore(data.data.pagination.hasMore);
        setPage(pageNum);
      } finally {
        setLoading(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" className="space-y-8">
      <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600">
        <ArrowLeft size={16} /> Back to Explore
      </Link>
      <div
        className="overflow-hidden rounded-3xl p-8 text-white shadow-card"
        style={{
          background: `linear-gradient(135deg, ${meta?.color || '#e11d48'}cc, ${meta?.color || '#881337'})`,
        }}
      >
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {getCategoryLabel(slug)}
        </h1>
        <p className="mt-2 max-w-lg text-white/85">
          Curated inspiration and community uploads — blended in one beautiful feed.
        </p>
      </div>
      <MasonryFeed
        posts={posts}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => !loading && hasMore && fetchPosts(page + 1)}
        onOpenPost={setSelectedPost}
        emptyTitle="No pins in this category yet"
      />
      <PostModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
    </motion.div>
  );
}
