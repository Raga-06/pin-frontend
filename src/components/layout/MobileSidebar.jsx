import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Compass, Bookmark, User, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLogout } from '../../hooks/useLogout';
import UserAvatar from '../ui/UserAvatar';
import LogoutButton from '../ui/LogoutButton';

export default function MobileSidebar({ isOpen, onClose }) {
  const { isAuthenticated, user } = useAuthStore();
  const performLogout = useLogout();

  const handleLogout = async () => {
    onClose();
    await performLogout();
  };

  const authLinks = isAuthenticated
    ? [
        { to: `/profile/${user?.username}`, icon: User, label: 'My Profile' },
        { to: '/saved', icon: Bookmark, label: 'Saved Posts' },
        {
          to: `/profile/${user?.username}`,
          icon: Settings,
          label: 'Settings',
          state: { openSettings: true },
        },
      ]
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col glass-strong lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-200/50 p-6 dark:border-gray-800/50">
              <span className="font-display text-xl font-bold">PinSphere</span>
              <button type="button" onClick={onClose} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>

            {isAuthenticated && user && (
              <div className="flex items-center gap-3 border-b border-gray-200/50 px-6 py-4 dark:border-gray-800/50">
                <UserAvatar user={user} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Home size={20} /> Home
              </Link>
              <Link
                to="/explore"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Compass size={20} /> Explore
              </Link>
              {authLinks.map(({ to, icon: Icon, label, state }) => (
                <Link
                  key={label}
                  to={to}
                  state={state}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Icon size={20} /> {label}
                </Link>
              ))}
            </nav>

            {isAuthenticated && (
              <div className="border-t border-gray-200/50 p-4 dark:border-gray-800/50">
                <LogoutButton variant="menu" onClick={handleLogout} />
              </div>
            )}

            {!isAuthenticated && (
              <div className="space-y-2 border-t border-gray-200/50 p-4 dark:border-gray-800/50">
                <Link to="/login" onClick={onClose} className="btn-secondary block w-full text-center">
                  Log in
                </Link>
                <Link to="/register" onClick={onClose} className="btn-primary block w-full text-center">
                  Sign up
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
