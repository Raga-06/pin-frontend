import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService, normalizeUserId } from '../../services/userService';
import { useAuthStore } from '../../store/useAuthStore';

export default function FollowButton({ profileUser, isFollowing: initialFollowing, onUpdate }) {
  const { isAuthenticated } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing, profileUser._id]);

  if (!isAuthenticated) {
    return (
      <a href="/login" className="btn-primary text-sm">
        <UserPlus size={16} /> Follow
      </a>
    );
  }

  const targetUserId = normalizeUserId(profileUser._id);

  const handleClick = async () => {
    if (loading) return;
    if (!targetUserId || targetUserId.length !== 24) {
      toast.error('Invalid user profile. Please refresh the page.');
      return;
    }

    const prevFollowing = isFollowing;
    const prevFollowersCount = profileUser.followersCount;

    setIsFollowing(!prevFollowing);
    onUpdate?.({
      isFollowing: !prevFollowing,
      followersCount: prevFollowing ? prevFollowersCount - 1 : prevFollowersCount + 1,
    });

    setLoading(true);
    try {
      const { data } = prevFollowing
        ? await userService.unfollowUser(targetUserId)
        : await userService.followUser(targetUserId);

      const result = data.data;
      setIsFollowing(result.isFollowing);
      onUpdate?.({
        isFollowing: result.isFollowing,
        followersCount: result.user?.followersCount,
        currentUserFollowingCount: result.currentUser?.followingCount,
        currentUserFollowersCount: result.currentUser?.followersCount,
      });
      toast.success(prevFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (err) {
      setIsFollowing(prevFollowing);
      onUpdate?.({
        isFollowing: prevFollowing,
        followersCount: prevFollowersCount,
      });
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
        isFollowing
          ? 'border-2 border-gray-300 bg-white text-gray-800 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400'
          : 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/40'
      } ${loading ? 'cursor-wait opacity-80' : ''}`}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck size={18} />
          Following
        </>
      ) : (
        <>
          <UserPlus size={18} />
          Follow
        </>
      )}
    </motion.button>
  );
}
