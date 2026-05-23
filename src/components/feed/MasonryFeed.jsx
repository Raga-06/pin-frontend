import { motion } from 'framer-motion';
import { staggerContainer } from '../../animations/variants';
import PinCard from './PinCard';
import SkeletonCards from '../ui/SkeletonCards';
import EmptyState from '../ui/EmptyState';
import InfiniteScrollLoader from './InfiniteScrollLoader';

export default function MasonryFeed({
  posts,
  loading,
  hasMore,
  onLoadMore,
  onOpenPost,
  emptyTitle,
  emptyDescription,
}) {
  if (loading && posts.length === 0) {
    return <SkeletonCards />;
  }

  if (!loading && posts.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No pins yet'}
        description={emptyDescription || 'Be the first to share something inspiring.'}
      />
    );
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5"
      >
        {posts.map((post) => (
          <PinCard key={post._id} post={post} onOpen={onOpenPost} />
        ))}
      </motion.div>
      <InfiniteScrollLoader hasMore={hasMore} isLoading={loading} onLoadMore={onLoadMore} />
    </>
  );
}
