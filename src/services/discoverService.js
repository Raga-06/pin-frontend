import api from './api';

export const discoverService = {
  getCategories: () => api.get('/discover/categories'),
  getTrending: (params) => api.get('/discover/trending', { params }),
  getLatest: (params) => api.get('/discover/latest', { params }),
  getRecommended: (params) => api.get('/discover/recommended', { params }),
};
