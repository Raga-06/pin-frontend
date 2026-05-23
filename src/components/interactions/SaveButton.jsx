import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { interactionService } from '../../services/interactionService';
import { useAuthStore } from '../../store/useAuthStore';

export default function SaveButton({ post, onUpdate, showLabel = false }) {
  const { isAuthenticated } = useAuthStore();
  const [saved, setSaved] = useState(post?.isSaved || false);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save posts');
      return;
    }
    const prev = saved;
    setSaved(!saved);
    setLoading(true);
    try {
      const { data } = await interactionService.toggleSave(post._id);
      setSaved(data.data.saved);
      onUpdate?.({ isSaved: data.data.saved, savesCount: data.data.savesCount });
      toast.success(data.data.saved ? 'Saved to collection' : 'Removed from collection');
    } catch {
      setSaved(prev);
      toast.error('Failed to update save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 rounded-full px-3 py-2 font-medium transition-colors ${
        saved
          ? 'bg-brand-600 text-white'
          : 'bg-white/90 text-gray-800 hover:bg-brand-50 dark:bg-gray-800 dark:text-white'
      }`}
      aria-label={saved ? 'Unsave' : 'Save'}
      aria-pressed={saved}
    >
      <motion.span whileTap={{ scale: 1.2 }}>
        <Bookmark size={18} className={saved ? 'fill-current' : ''} />
      </motion.span>
      {showLabel && <span className="text-sm">{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
