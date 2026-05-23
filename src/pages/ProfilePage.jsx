import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileSettings from '../components/profile/ProfileSettings';
import EditProfileModal from '../components/profile/EditProfileModal';
import MasonryFeed from '../components/feed/MasonryFeed';
import PostModal from '../components/modals/PostModal';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { interactionService } from '../services/interactionService';
import { useAuthStore } from '../store/useAuthStore';
import SkeletonCards from '../components/ui/SkeletonCards';

export default function ProfilePage() {
  const { username } = useParams();
  const location = useLocation();
  const { user: currentUser, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('pins');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const isOwn = currentUser?.username === username;

  const loadProfile = useCallback(async () => {
    const { data } = await userService.getProfile(username);
    setProfile(data.data.user);
    return data.data.user;
  }, [username]);

  useEffect(() => {
    if (location.state?.openSettings && isOwn) {
      setTab('settings');
      const el = document.getElementById('profile-settings');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.state, isOwn]);

  useEffect(() => {
    const load = async () => {
      if (tab === 'settings') {
        setLoading(false);
        if (!profile) {
          try {
            await loadProfile();
          } catch {
            /* handled below */
          }
        }
        return;
      }
      setLoading(true);
      try {
        const profileUser = await loadProfile();
        if (tab === 'pins') {
          const { data } = await postService.getUserPosts(profileUser._id);
          setPosts(data.data.posts);
        } else if (tab === 'saved' && isOwn) {
          const { data } = await interactionService.getSaved();
          setPosts(data.data.posts.filter(Boolean));
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username, tab, isOwn, loadProfile]);

  const handleFollowUpdate = ({
    isFollowing,
    followersCount,
    currentUserFollowingCount,
    currentUserFollowersCount,
  }) => {
    setProfile((prev) =>
      prev ? { ...prev, isFollowing, followersCount } : prev
    );

    if (currentUser && (currentUserFollowingCount !== undefined || currentUserFollowersCount !== undefined)) {
      updateUser({
        ...currentUser,
        ...(currentUserFollowingCount !== undefined && { followingCount: currentUserFollowingCount }),
        ...(currentUserFollowersCount !== undefined && { followersCount: currentUserFollowersCount }),
      });
    }
  };

  if (!profile && tab !== 'settings') {
    if (loading) return <SkeletonCards count={4} />;
    return <p className="py-20 text-center">User not found</p>;
  }

  const tabs = ['pins', ...(isOwn ? ['saved', 'settings'] : [])];

  return (
    <div className="space-y-8">
      {profile && (
        <ProfileHeader
          user={profile}
          isOwn={isOwn}
          onEdit={() => setEditOpen(true)}
          onFollowUpdate={handleFollowUpdate}
        />
      )}

      <div className="flex gap-4 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors ${
              tab === t
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'pins' ? 'Pins' : t === 'saved' ? 'Saved' : 'Settings'}
          </button>
        ))}
      </div>

      {tab === 'settings' && isOwn ? (
        <ProfileSettings onEditProfile={() => setEditOpen(true)} />
      ) : (
        <MasonryFeed
          posts={posts}
          loading={loading}
          hasMore={false}
          onLoadMore={() => {}}
          onOpenPost={setSelectedPost}
          emptyTitle={tab === 'saved' ? 'No saved pins' : 'No pins yet'}
        />
      )}

      {isOwn && (
        <EditProfileModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          user={currentUser}
        />
      )}
      <PostModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
