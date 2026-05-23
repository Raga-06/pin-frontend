import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    }),
  initTheme: () => {
    const theme = getInitialTheme();
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
}));
