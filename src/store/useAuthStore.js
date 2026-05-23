import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import { clearAuthSession } from '../utils/authSession';
import { STORAGE_KEYS } from '../constants';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        set({ user, token, isAuthenticated: true });
      },

      /**
       * Clears session locally and optionally calls API logout.
       * @param {{ skipApi?: boolean }} options - skipApi when token is already invalid (401)
       */
      logout: async ({ skipApi = false } = {}) => {
        if (!skipApi) {
          try {
            await authService.logout();
          } catch {
            /* server unreachable or token expired — still clear client session */
          }
        }
        clearAuthSession();
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      fetchUser: async () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) {
          clearAuthSession();
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          return;
        }
        set({ isLoading: true });
        try {
          const { data } = await authService.getMe();
          set({ user: data.data.user, token, isAuthenticated: true });
        } catch {
          clearAuthSession();
          set({ user: null, token: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'pinsphere-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
