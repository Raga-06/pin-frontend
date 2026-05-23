import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

export default function InfiniteScrollLoader({ hasMore, isLoading, onLoadMore }) {
  const setRef = useInfiniteScroll({ onLoadMore, hasMore, isLoading });

  if (!hasMore && !isLoading) return null;

  return (
    <div ref={setRef} className="flex justify-center py-8" aria-live="polite">
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading more...</span>
        </div>
      )}
    </div>
  );
}
