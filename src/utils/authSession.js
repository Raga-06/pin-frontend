import { STORAGE_KEYS } from '../constants';

const PERSIST_KEY = 'pinsphere-auth';

/** Clears all client-side auth artifacts (token, user cache, Zustand persist). */
export const clearAuthSession = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(PERSIST_KEY);
};
