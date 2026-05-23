import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { interactionService } from '../../services/interactionService';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCount } from '../../utils/helpers';

export default function LikeButton({ post, onUpdate, compact = false }) {
  const { isAuthenticated } = useAuthStore();
  const [liked, setLiked] = useState(post?.isLiked || false);
  const [count, setCount] = useState(post?.likesCount || 0);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to like posts');
      return;
    }
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setLoading(true);
    try {
      const { data } = await interactionService.toggleLike(post._id);
      setLiked(data.data.liked);
      setCount(data.data.likesCount);
      onUpdate?.({ isLiked: data.data.liked, likesCount: data.data.likesCount });
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-full transition-colors ${
        liked ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600 dark:text-gray-300'
      } ${compact ? 'p-2' : 'px-3 py-2'}`}
      aria-label={liked ? 'Unlike' : 'Like'}
      aria-pressed={liked}
    >
      <motion.span whileTap={{ scale: 1.3 }}>
        <Heart size={compact ? 18 : 20} className={liked ? 'fill-current' : ''} />
      </motion.span>
      {!compact && <span className="text-sm font-medium">{formatCount(count)}</span>}
    </button>
  );
}
