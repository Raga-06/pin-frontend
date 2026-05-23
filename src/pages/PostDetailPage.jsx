import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { postService } from '../services/postService';
import { getImageSrc } from '../utils/helpers';
import UserAvatar from '../components/ui/UserAvatar';
import LikeButton from '../components/interactions/LikeButton';
import SaveButton from '../components/interactions/SaveButton';
import ShareButton from '../components/interactions/ShareButton';
import CommentSection from '../components/comments/CommentSection';
import PinCard from '../components/feed/PinCard';
import SkeletonCards from '../components/ui/SkeletonCards';
import { pageTransition } from '../animations/variants';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService.getPost(id).then(({ data }) => {
      setPost(data.data.post);
      setRelated(data.data.related || []);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonCards count={2} />;
  if (!post) return <p className="text-center py-20">Post not found</p>;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" className="space-y-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600">
        <ArrowLeft size={16} /> Back to feed
      </Link>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
          <img src={getImageSrc(post.image)} alt={post.title} className="w-full object-contain" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{post.title}</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{post.description}</p>
          <Link to={`/profile/${post.author?.username}`} className="mt-6 flex items-center gap-3">
            <UserAvatar user={post.author} />
            <div>
              <p className="font-semibold">{post.author?.name}</p>
              <p className="text-sm text-gray-500">@{post.author?.username}</p>
            </div>
          </Link>
          <div className="mt-6 flex items-center gap-3 border-y border-gray-200 py-4 dark:border-gray-700">
            <LikeButton post={post} onUpdate={(u) => setPost({ ...post, ...u })} />
            <SaveButton post={post} showLabel onUpdate={(u) => setPost({ ...post, ...u })} />
            <ShareButton post={post} />
          </div>
          <div className="mt-8">
            <h2 className="mb-4 font-semibold">Comments</h2>
            <CommentSection postId={post._id} />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section>
          <h2 className="mb-6 font-display text-xl font-bold">More like this</h2>
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {related.map((p) => (
              <PinCard key={p._id} post={p} onOpen={(pin) => navigate(`/post/${pin._id}`)} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
