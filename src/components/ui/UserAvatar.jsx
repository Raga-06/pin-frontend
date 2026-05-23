import { getImageSrc } from '../../utils/helpers';

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14', xl: 'h-24 w-24' };
  const initials = user?.name?.charAt(0)?.toUpperCase() || '?';

  if (user?.avatar) {
    return (
      <img
        src={getImageSrc(user.avatar)}
        alt={user.name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-800 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-sm font-bold text-white ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
