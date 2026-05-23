import api from './api';

/** Normalize MongoDB _id to a 24-char hex string */
export const normalizeUserId = (id) => {
  if (!id) return '';
  if (typeof id === 'object' && id !== null) {
    return id.toString?.() || String(id);
  }
  return String(id).trim();
};

export const userService = {
  getProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (formData) =>
    api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  followUser: (userId) => api.post(`/follow/${normalizeUserId(userId)}`),
  unfollowUser: (userId) => api.delete(`/follow/${normalizeUserId(userId)}`),
};
