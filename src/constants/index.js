export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'photography', label: 'Photography', color: '#6366f1' },
  { id: 'fashion', label: 'Fashion', color: '#ec4899' },
  { id: 'travel', label: 'Travel', color: '#14b8a6' },
  { id: 'nature', label: 'Nature', color: '#22c55e' },
  { id: 'architecture', label: 'Architecture', color: '#64748b' },
  { id: 'food', label: 'Food', color: '#f97316' },
  { id: 'technology', label: 'Technology', color: '#3b82f6' },
  { id: 'art', label: 'Art', color: '#a855f7' },
  { id: 'anime', label: 'Anime', color: '#f43f5e' },
  { id: 'minimal-design', label: 'Minimal Design', color: '#78716c' },
  { id: 'interior-design', label: 'Interior Design', color: '#d97706' },
  { id: 'cars', label: 'Cars', color: '#ef4444' },
  { id: 'fitness', label: 'Fitness', color: '#10b981' },
  { id: 'wallpapers', label: 'Wallpapers', color: '#8b5cf6' },
];

export const STORAGE_KEYS = {
  TOKEN: 'pinsphere_token',
  USER: 'pinsphere_user',
  THEME: 'pinsphere_theme',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  EXPLORE: '/explore',
  SEARCH: '/search',
  PROFILE: '/profile',
  POST: '/post',
  SAVED: '/saved',
  CATEGORY: '/category',
};

export const getCategoryLabel = (id) =>
  CATEGORIES.find((c) => c.id === id)?.label || id?.replace(/-/g, ' ') || 'Unknown';
