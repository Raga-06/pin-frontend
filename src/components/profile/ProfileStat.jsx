import { motion, AnimatePresence } from 'framer-motion';
import { formatCount } from '../../utils/helpers';

export default function ProfileStat({ label, count, onClick }) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`text-left transition-opacity ${onClick ? 'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-500/30 rounded-lg px-1' : ''}`}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={count}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className="font-display text-xl font-bold tabular-nums"
        >
          {formatCount(count)}
        </motion.p>
      </AnimatePresence>
      <p className="text-sm text-gray-500">{label}</p>
    </Wrapper>
  );
}
