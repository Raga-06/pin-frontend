import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LogoutButton({
  onClick,
  loading = false,
  variant = 'menu',
  className = '',
  label = 'Log out',
}) {
  const variants = {
    menu:
      'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40',
    card:
      'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100 hover:shadow-md dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50',
    compact:
      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40',
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className={`${variants[variant]} ${loading ? 'cursor-wait opacity-60' : ''} ${className}`}
      aria-label={label}
    >
      <LogOut size={18} className={loading ? 'animate-pulse' : ''} />
      <span>{loading ? 'Signing out...' : label}</span>
    </motion.button>
  );
}
