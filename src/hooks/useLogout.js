import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '../constants';

/**
 * Centralized logout — clears session, updates store, redirects, optional toast.
 */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useCallback(
    async ({
      redirectTo = ROUTES.LOGIN,
      showToast = true,
      skipApi = false,
      message = 'Logged out successfully',
    } = {}) => {
      await logout({ skipApi });
      if (showToast && message) {
        toast.success(message);
      }
      navigate(redirectTo, { replace: true });
    },
    [logout, navigate]
  );
}
