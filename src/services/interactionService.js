import api from './api';

export const interactionService = {
  toggleLike: (postId) => api.post(`/interactions/like/${postId}`),
  toggleSave: (postId) => api.post(`/interactions/save/${postId}`),
  getSaved: (params) => api.get('/interactions/saved', { params }),
  getComments: (postId, params) => api.get(`/interactions/comments/${postId}`, { params }),
  addComment: (postId, text) => api.post(`/interactions/comments/${postId}`, { text }),
  deleteComment: (id) => api.delete(`/interactions/comments/${id}`),
};
