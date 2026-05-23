import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MasonryFeed from '../components/feed/MasonryFeed';
import PostModal from '../components/modals/PostModal';
import { searchService } from '../services/searchService';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const search = async (pageNum = 1, reset = false) => {
    if (!query) {
      setPosts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchService.search({ q: query, page: pageNum, limit: 20 });
      setPosts((prev) => (reset ? data.data.posts : [...prev, ...data.data.posts]));
      setHasMore(data.data.pagination.hasMore);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(1, true);
  }, [query]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">
        Results for &ldquo;{query}&rdquo;
      </h1>
      <MasonryFeed
        posts={posts}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => !loading && hasMore && search(page + 1)}
        onOpenPost={setSelectedPost}
        emptyTitle="No results found"
        emptyDescription="Try different keywords or browse categories."
      />
      <PostModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
