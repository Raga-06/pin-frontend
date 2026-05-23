import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareButton({ post }) {
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post._id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch {
      toast.error('Could not share');
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label="Share post"
    >
      <Share2 size={18} />
    </button>
  );
}
