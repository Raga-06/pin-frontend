import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { ROUTES } from './constants';

function AppInitializer() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const initTheme = useThemeStore((s) => s.initTheme);
  const navigate = useNavigate();

  useEffect(() => {
    initTheme();
    fetchUser();
  }, [fetchUser, initTheme]);

  useEffect(() => {
    const onSessionExpired = (e) => {
      const msg = e.detail?.message || 'Your session has expired. Please sign in again.';
      toast.error(msg);
      navigate(ROUTES.LOGIN, { replace: true });
    };
    window.addEventListener('pinsphere:session-expired', onSessionExpired);
    return () => window.removeEventListener('pinsphere:session-expired', onSessionExpired);
  }, [navigate]);

  return <AppRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: 'var(--toast-bg, #1f2937)',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  );
}
