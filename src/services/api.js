import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../constants';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isHandlingUnauthorized = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Request failed';

    if (status === 401 && !error.config?.skipAuthRedirect) {
      const { isAuthenticated, logout } = useAuthStore.getState();
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint =
        requestUrl.includes('/auth/login')
        || requestUrl.includes('/auth/register')
        || requestUrl.includes('/auth/logout');

      if (isAuthenticated && !isAuthEndpoint && !isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        await logout({ skipApi: true });
        window.dispatchEvent(
          new CustomEvent('pinsphere:session-expired', {
            detail: { message: 'Your session has expired. Please sign in again.' },
          })
        );
        isHandlingUnauthorized = false;
      }
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;
