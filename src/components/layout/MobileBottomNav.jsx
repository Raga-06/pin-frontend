import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, Bookmark, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

export default function MobileBottomNav({ onUpload }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { action: onUpload, icon: Plus, label: 'Create', accent: true },
    { to: '/saved', icon: Bookmark, label: 'Saved', auth: true },
    {
      to: user ? `/profile/${user.username}` : '/login',
      icon: User,
      label: 'Profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200/80 bg-white/90 pb-safe backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/90 lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {items.map(({ to, icon: Icon, label, accent, auth, action }) => {
          if (auth && !isAuthenticated) return null;
          const active = to && location.pathname === to;

          if (accent) {
            return (
              <button
                key={label}
                type="button"
                onClick={action}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                aria-label={label}
              >
                <Icon size={22} />
              </button>
            );
          }

          const Comp = to ? Link : 'button';
          return (
            <Comp
              key={label}
              to={to}
              onClick={action}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
                active ? 'text-brand-600' : 'text-gray-500'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="mobile-nav-pill"
                  className="absolute -top-1 h-1 w-8 rounded-full bg-brand-600"
                />
              )}
              <Icon size={20} />
              {label}
            </Comp>
          );
        })}
      </div>
    </nav>
  );
}
