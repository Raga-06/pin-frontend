import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { discoverService } from '../../services/discoverService';
import PinCard from './PinCard';
import { slideUp } from '../../animations/variants';

export default function TrendingSection({ onOpenPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    discoverService
      .getTrending({ limit: 8 })
      .then(({ data }) => setPosts(data.data.posts))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-64 w-48 shrink-0 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!posts.length) return null;

  return (
    <motion.section variants={slideUp} initial="hidden" animate="visible" className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Trending now</h2>
            <p className="text-sm text-gray-500">Most loved pins this week</p>
          </div>
        </div>
        <Link
          to="/explore"
          className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
        >
          Explore all <ChevronRight size={16} />
        </Link>
      </div>
      <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto pb-2 px-1">
        {posts.map((post, i) => (
          <div key={post._id} className="w-56 shrink-0 sm:w-64">
            <PinCard post={post} onOpen={onOpenPost} priority={i < 2} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
