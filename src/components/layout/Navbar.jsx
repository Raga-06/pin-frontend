import { Link } from 'react-router-dom';
import { Plus, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { CATEGORIES } from '../../constants';
import SearchBar from '../search/SearchBar';
import ThemeToggle from '../ui/ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import Button from '../ui/Button';

export default function Navbar({ onMenuClick, onUpload }) {
  const { isAuthenticated } = useAuthStore();

  const shortcuts = CATEGORIES.filter((c) => c.id !== 'all').slice(0, 6);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/40 bg-white/75 backdrop-blur-2xl dark:border-gray-800/40 dark:bg-gray-950/75">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src="/pinsphere.svg" alt="" className="h-8 w-8" />
          <span className="font-display hidden text-xl font-bold sm:block">
            Pin<span className="text-brand-600">Sphere</span>
          </span>
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar className="w-full max-w-xl" />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <NotificationDropdown />
          {isAuthenticated ? (
            <>
              <Button onClick={onUpload} className="hidden sm:flex">
                <Plus size={18} /> Create
              </Button>
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link to="/login" className="hidden text-sm font-medium hover:text-brand-600 sm:block">
                Log in
              </Link>
              <Link to="/register">
                <Button className="text-sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="scrollbar-hide hidden border-t border-gray-200/40 px-4 py-2 dark:border-gray-800/40 md:block">
        <div className="mx-auto flex max-w-[1600px] gap-2 overflow-x-auto">
          {shortcuts.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="shrink-0 rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-brand-900/30 dark:hover:text-brand-300"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200/40 px-4 py-2 md:hidden dark:border-gray-800/40">
        <SearchBar />
      </div>
    </header>
  );
}
