import api from './api';

export const postService = {
  getFeed: (params) => api.get('/posts/feed', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) =>
    api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getUserPosts: (userId, params) => api.get(`/posts/user/${userId}`, { params }),
};
