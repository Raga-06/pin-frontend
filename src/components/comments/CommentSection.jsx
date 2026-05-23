import { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { interactionService } from '../../services/interactionService';
import { useAuthStore } from '../../store/useAuthStore';
import UserAvatar from '../ui/UserAvatar';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const fetchComments = async () => {
    try {
      const { data } = await interactionService.getComments(postId);
      setComments(data.data.comments);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !isAuthenticated) return;
    setSubmitting(true);
    const optimistic = {
      _id: `temp-${Date.now()}`,
      text: text.trim(),
      author: user,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [optimistic, ...prev]);
    setText('');
    try {
      const { data } = await interactionService.addComment(postId, optimistic.text);
      setComments((prev) => [data.data.comment, ...prev.filter((c) => c._id !== optimistic._id)]);
      toast.success('Comment added');
    } catch {
      setComments((prev) => prev.filter((c) => c._id !== optimistic._id));
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await interactionService.deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="space-y-4">
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <UserAvatar user={user} size="sm" />
          <div className="flex flex-1 gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="input-field flex-1"
              aria-label="Comment text"
            />
            <button type="submit" disabled={submitting || !text.trim()} className="btn-primary px-4">
              <Send size={18} />
            </button>
          </div>
        </form>
      )}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton h-8 w-8 rounded-full" />
              <div className="skeleton h-12 flex-1 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="flex gap-3">
              <UserAvatar user={comment.author} size="sm" />
              <div className="flex-1 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{comment.author?.name}</span>
                  {user?._id === comment.author?._id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{comment.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
