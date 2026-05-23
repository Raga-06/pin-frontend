import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../animations/variants';
import { getImageSrc } from '../../utils/helpers';

export default function CategoryGrid({ categories }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {categories
        .filter((c) => c.id !== 'all')
        .map((cat) => (
          <motion.div key={cat.id} variants={staggerItem}>
            <Link
              to={`/category/${cat.id}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-card-hover dark:ring-white/10"
            >
              {cat.coverImage ? (
                <img
                  src={getImageSrc(cat.coverImage)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${cat.color || '#e11d48'}99, ${cat.color || '#881337'})` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display text-lg font-bold text-white">{cat.label}</p>
                <p className="text-sm text-white/70">{cat.count || 0} pins</p>
              </div>
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </motion.div>
        ))}
    </motion.div>
  );
}
