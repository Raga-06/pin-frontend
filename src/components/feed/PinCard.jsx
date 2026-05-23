import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { staggerItem } from '../../animations/variants';
import { getImageSrc, getCategoryLabel } from '../../utils/helpers';
import UserAvatar from '../ui/UserAvatar';
import LikeButton from '../interactions/LikeButton';
import SaveButton from '../interactions/SaveButton';
import ShareButton from '../interactions/ShareButton';

export default function PinCard({ post, onOpen, priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const height = post.imageHeight || 300;

  if (failed || !post.image) {
    return null;
  }

  return (
    <motion.article
      variants={staggerItem}
      layout
      className="masonry-item group relative mb-4 break-inside-avoid"
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-card ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-card-hover dark:bg-gray-800 dark:ring-white/5"
        style={{ minHeight: height }}
        role="button"
        tabIndex={0}
        onClick={() => onOpen?.(post)}
        onKeyDown={(e) => e.key === 'Enter' && onOpen?.(post)}
        aria-label={`View ${post.title}`}
      >
        <div
          className={`absolute inset-0 skeleton transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden
        />
        <img
          src={getImageSrc(post.image)}
          alt={post.title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`block w-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
            loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm scale-105'
          }`}
          style={{ minHeight: height }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {post.category && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-md dark:bg-gray-900/90 dark:text-white">
              {getCategoryLabel(post.category)}
            </span>
          )}
          {post.isSeeded && (
            <span className="flex items-center gap-1 rounded-full bg-brand-600/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              <Sparkles size={10} /> Curated
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
          <LikeButton post={post} compact />
        </div>
        <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="line-clamp-2 font-semibold text-white drop-shadow-sm">{post.title}</h3>
          <div className="mt-3 flex items-center justify-between gap-2">
            {post.author?.username ? (
              <Link
                to={`/profile/${post.author.username}`}
                onClick={(e) => e.stopPropagation()}
                className="flex min-w-0 items-center gap-2"
              >
                <UserAvatar user={post.author} size="sm" />
                <span className="truncate text-sm font-medium text-white/90">
                  {post.author.name}
                </span>
              </Link>
            ) : (
              <span className="text-sm text-white/80">PinSphere</span>
            )}
            <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <SaveButton post={post} />
              <ShareButton post={post} />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
