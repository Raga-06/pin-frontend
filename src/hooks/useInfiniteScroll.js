import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = ({ onLoadMore, hasMore, isLoading }) => {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  const setTarget = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoading && hasMore) {
            loadMoreRef.current();
          }
        },
        { rootMargin: '200px' }
      );
      observerRef.current.observe(node);
    },
    [hasMore, isLoading]
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return setTarget;
};
