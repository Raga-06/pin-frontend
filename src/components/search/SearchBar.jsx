import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService } from '../../services/searchService';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ tags: [], titles: [] });
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (debounced.length < 2) {
      setSuggestions({ tags: [], titles: [] });
      return;
    }
    searchService.suggestions(debounced).then(({ data }) => {
      setSuggestions(data.data);
    }).catch(() => {});
  }, [debounced]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search pins, tags, ideas..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:bg-gray-900 sm:w-72 lg:w-96"
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </form>
      <AnimatePresence>
        {open && (suggestions.tags?.length > 0 || suggestions.titles?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 glass-strong rounded-xl p-3 shadow-xl"
          >
            {suggestions.titles?.map((title) => (
              <button
                key={title}
                type="button"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => { setQuery(title); navigate(`/search?q=${encodeURIComponent(title)}`); setOpen(false); }}
              >
                {title}
              </button>
            ))}
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.tags?.map(({ tag }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setQuery(tag); navigate(`/search?q=${encodeURIComponent(tag)}`); setOpen(false); }}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
