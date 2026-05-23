import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, UserCog, Shield } from 'lucide-react';
import { useLogout } from '../../hooks/useLogout';
import LogoutButton from '../ui/LogoutButton';

export default function ProfileSettings({ onEditProfile }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const performLogout = useLogout();

  const handleLogout = async () => {
    setLoggingOut(true);
    await performLogout();
    setLoggingOut(false);
  };

  return (
    <motion.section
      id="profile-settings"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-card dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Account Settings</h2>
            <p className="text-sm text-gray-500">Manage your profile and session</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <button
          type="button"
          onClick={onEditProfile}
          className="flex w-full items-center gap-4 rounded-xl border border-gray-200 px-4 py-4 text-left transition-all hover:border-brand-200 hover:bg-brand-50/50 dark:border-gray-700 dark:hover:border-brand-800 dark:hover:bg-brand-900/20"
        >
          <UserCog size={20} className="text-gray-500" />
          <div>
            <p className="font-medium">Edit profile</p>
            <p className="text-sm text-gray-500">Update name, bio, avatar, and links</p>
          </div>
        </button>

        <div className="flex items-start gap-4 rounded-xl border border-gray-200 px-4 py-4 dark:border-gray-700">
          <Shield size={20} className="mt-0.5 text-gray-500" />
          <div className="flex-1">
            <p className="font-medium">Session</p>
            <p className="text-sm text-gray-500">
              Sign out on this device. You will need to log in again to access saved content.
            </p>
            <div className="mt-4 max-w-xs">
              <LogoutButton
                variant="card"
                onClick={handleLogout}
                loading={loggingOut}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
