import { useState, useEffect } from 'react';
import MasonryFeed from '../components/feed/MasonryFeed';
import PostModal from '../components/modals/PostModal';
import { interactionService } from '../services/interactionService';

export default function SavedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    interactionService.getSaved().then(({ data }) => {
      setPosts(data.data.posts.filter(Boolean));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Saved Pins</h1>
      <MasonryFeed
        posts={posts}
        loading={loading}
        hasMore={false}
        onLoadMore={() => {}}
        onOpenPost={setSelectedPost}
        emptyTitle="No saved pins yet"
        emptyDescription="Save pins you love to find them here."
      />
      <PostModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
