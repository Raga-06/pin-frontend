import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-mesh" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="font-display text-2xl font-bold">
            Pin<span className="text-white/80">Sphere</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl font-extrabold leading-tight">
              Where creativity meets discovery
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/80">
              Join thousands of creators sharing visual inspiration every day.
            </p>
          </motion.div>
          <p className="text-sm text-white/60">© 2026 PinSphere. All rights reserved.</p>
        </div>
      </div>
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
