import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Settings } from 'lucide-react';
import { getImageSrc } from '../../utils/helpers';
import UserAvatar from '../ui/UserAvatar';
import ProfileStat from './ProfileStat';
import FollowButton from './FollowButton';

export default function ProfileHeader({
  user,
  isOwn,
  onEdit,
  onFollowUpdate,
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card dark:bg-gray-900">
      <div className="relative h-40 sm:h-52">
        {user.coverImage ? (
          <img src={getImageSrc(user.coverImage)} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500" />
        )}
      </div>
      <div className="relative px-6 pb-6">
        <div className="-mt-12 sm:-mt-16">
          <UserAvatar user={user} size="xl" className="ring-4 ring-white dark:ring-gray-900" />
        </div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-2xl font-bold sm:text-3xl"
            >
              {user.name}
            </motion.h1>
            <p className="text-gray-500">@{user.username}</p>
            {user.bio && (
              <p className="mt-3 max-w-xl text-gray-600 dark:text-gray-300">{user.bio}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {user.location}
                </span>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-600 hover:underline"
                >
                  <LinkIcon size={14} /> Website
                </a>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {isOwn ? (
              <button type="button" onClick={onEdit} className="btn-secondary">
                <Settings size={16} /> Edit profile
              </button>
            ) : (
              <FollowButton
                profileUser={user}
                isFollowing={user.isFollowing}
                onUpdate={onFollowUpdate}
              />
            )}
          </div>
        </div>
        <div className="mt-6 flex gap-8 border-t border-gray-100 pt-6 dark:border-gray-800">
          <ProfileStat label="Followers" count={user.followersCount || 0} />
          <ProfileStat label="Following" count={user.followingCount || 0} />
        </div>
      </div>
    </div>
  );
}
