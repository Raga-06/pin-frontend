import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, User, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

const links = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/saved', icon: Bookmark, label: 'Saved', auth: true },
];

export default function DesktopSidebar({ onUpload }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-20 flex-col items-center gap-2 border-r border-gray-200/50 py-6 dark:border-gray-800/50 lg:flex">
      {isAuthenticated && (
        <button
          type="button"
          onClick={onUpload}
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-105"
          aria-label="Create pin"
        >
          <Plus size={24} />
        </button>
      )}
      {links.map(({ to, icon: Icon, label, auth }) => {
        if (auth && !isAuthenticated) return null;
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className="group relative flex flex-col items-center gap-1 rounded-xl p-3 text-gray-500 transition-colors hover:text-brand-600 dark:text-gray-400"
            aria-label={label}
          >
            {active && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-xl bg-brand-50 dark:bg-brand-900/20"
              />
            )}
            <Icon size={22} className={`relative z-10 ${active ? 'text-brand-600' : ''}`} />
            <span className={`relative z-10 text-[10px] font-medium ${active ? 'text-brand-600' : ''}`}>
              {label}
            </span>
          </Link>
        );
      })}
      {isAuthenticated && user && (
        <Link
          to={`/profile/${user.username}`}
          className="mt-auto"
          aria-label="Profile"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-xs font-bold text-white">
            {user.name?.charAt(0)}
          </div>
        </Link>
      )}
    </aside>
  );
}
