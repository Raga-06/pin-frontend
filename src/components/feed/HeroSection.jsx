import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../ui/Button';

export default function HeroSection({ onUpload }) {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-mesh px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-hero-gradient opacity-10" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300">
            <Sparkles size={16} /> Visual discovery reimagined
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-display mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Discover ideas that{' '}
          <span className="text-gradient">inspire you</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300"
        >
          PinSphere brings together the best of Pinterest, Dribbble, and Behance — a premium space to explore, save, and share visual inspiration.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <Button onClick={onUpload}>
              Create a Pin <ArrowRight size={18} />
            </Button>
          ) : (
            <>
              <Link to="/register">
                <Button>Get started free</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">Sign in</Button>
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
