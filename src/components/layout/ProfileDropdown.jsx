import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bookmark, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLogout } from '../../hooks/useLogout';
import UserAvatar from '../ui/UserAvatar';
import LogoutButton from '../ui/LogoutButton';

export default function ProfileDropdown({ onOpenSettings }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef(null);
  const { user } = useAuthStore();
  const performLogout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    close();
    await performLogout();
    setLoggingOut(false);
  };

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      onClick: () => {
        close();
        navigate(`/profile/${user?.username}`);
      },
    },
    {
      icon: Bookmark,
      label: 'Saved Posts',
      onClick: () => {
        close();
        navigate('/saved');
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        close();
        if (onOpenSettings) {
          onOpenSettings();
        } else {
          navigate(`/profile/${user?.username}`, { state: { openSettings: true } });
        }
      },
    },
  ];

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-1 pr-2 ring-2 ring-transparent transition-all hover:ring-brand-500/30 focus:outline-none focus:ring-brand-500/40"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <UserAvatar user={user} />
        <ChevronDown
          size={16}
          className={`hidden text-gray-500 transition-transform sm:block ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 p-2 shadow-glass-lg backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-900/95"
          >
            <div className="border-b border-gray-100 px-3 py-3 dark:border-gray-800">
              <p className="truncate font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="truncate text-sm text-gray-500">@{user.username}</p>
            </div>

            <div className="py-1">
              {menuItems.map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  onClick={onClick}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Icon size={18} className="text-gray-500" />
                  {label}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-1 dark:border-gray-800">
              <LogoutButton
                variant="menu"
                onClick={handleLogout}
                loading={loggingOut}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
