import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock } from 'lucide-react';
import CategoryGrid from '../components/explore/CategoryGrid';
import MasonryFeed from '../components/feed/MasonryFeed';
import PostModal from '../components/modals/PostModal';
import { discoverService } from '../services/discoverService';
import { searchService } from '../services/searchService';
import { pageTransition } from '../animations/variants';

export default function ExplorePage() {
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    Promise.all([
      discoverService.getCategories(),
      discoverService.getTrending({ limit: 12 }),
      discoverService.getLatest({ limit: 12 }),
      searchService.trending(),
    ])
      .then(([catRes, trendRes, latestRes, tagRes]) => {
        setCategories(catRes.data.data.categories);
        setTrending(trendRes.data.data.posts);
        setLatest(latestRes.data.data.posts);
        setTags(tagRes.data.data.tags);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" className="space-y-12">
      <div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Explore</h1>
        <p className="mt-2 max-w-xl text-gray-500">
          Browse curated categories, trending pins, and fresh uploads — always something inspiring.
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <a
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-900"
            >
              #{tag} <span className="text-gray-400">({count})</span>
            </a>
          ))}
        </div>
      )}

      <section className="space-y-5">
        <h2 className="font-display text-xl font-bold">Categories</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : (
          <CategoryGrid categories={categories} />
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={22} />
          <h2 className="font-display text-xl font-bold">Trending</h2>
        </div>
        <MasonryFeed
          posts={trending}
          loading={loading}
          hasMore={false}
          onLoadMore={() => {}}
          onOpenPost={setSelectedPost}
        />
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Clock className="text-brand-600" size={22} />
          <h2 className="font-display text-xl font-bold">Latest uploads</h2>
        </div>
        <MasonryFeed
          posts={latest}
          loading={loading}
          hasMore={false}
          onLoadMore={() => {}}
          onOpenPost={setSelectedPost}
        />
      </section>

      <PostModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
    </motion.div>
  );
}
