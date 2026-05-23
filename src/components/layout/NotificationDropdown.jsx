import { Bell } from 'lucide-react';

export default function NotificationDropdown() {
  return (
    <button
      type="button"
      className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label="Notifications"
    >
      <Bell size={20} />
      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" aria-hidden />
    </button>
  );
}
