import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import { getImageSrc } from '../../utils/helpers';
import UserAvatar from '../ui/UserAvatar';
import LikeButton from '../interactions/LikeButton';
import SaveButton from '../interactions/SaveButton';
import ShareButton from '../interactions/ShareButton';
import CommentSection from '../comments/CommentSection';

export default function PostModal({ post, isOpen, onClose }) {
  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <div className="grid max-h-[85vh] gap-6 overflow-y-auto lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
          <img
            src={getImageSrc(post.image)}
            alt={post.title}
            className="max-h-[60vh] w-full object-contain lg:max-h-[75vh]"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-display text-2xl font-bold">{post.title}</h2>
          {post.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-300">{post.description}</p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-2">
              <UserAvatar user={post.author} />
              <div>
                <p className="font-semibold">{post.author?.name}</p>
                <p className="text-sm text-gray-500">@{post.author?.username}</p>
              </div>
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-2 border-y border-gray-200 py-4 dark:border-gray-700">
            <LikeButton post={post} />
            <SaveButton post={post} showLabel />
            <ShareButton post={post} />
          </div>
          {post.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-6 flex-1">
            <h3 className="mb-4 font-semibold">Comments</h3>
            <CommentSection postId={post._id} />
          </div>
          <Link
            to={`/post/${post._id}`}
            onClick={onClose}
            className="mt-4 text-center text-sm font-medium text-brand-600 hover:underline"
          >
            View full page →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
