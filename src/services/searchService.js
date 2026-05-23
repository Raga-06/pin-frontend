import api from './api';

export const searchService = {
  search: (params) => api.get('/search', { params }),
  suggestions: (q) => api.get('/search/suggestions', { params: { q } }),
  trending: () => api.get('/search/trending'),
};
