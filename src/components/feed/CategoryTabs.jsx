import { motion } from 'framer-motion';
import { CATEGORIES } from '../../constants';

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active === cat.id
              ? 'text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {active === cat.id && (
            <motion.span
              layoutId="category-pill"
              className="absolute inset-0 rounded-full bg-brand-600"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
