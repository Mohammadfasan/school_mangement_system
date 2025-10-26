import {api} from './api';

export const sportService = {
  // Public routes
  getAllSports: () => api.get('/api/sports'),
  getSportsByStatus: (status) => api.get(`/api/sports/status/${status}`),
  getSportById: (id) => api.get(`/api/sports/${id}`),
  
  // Admin routes
  createSport: (data) => api.post('/api/sports/create-sport', data),
  updateSport: (id, data) => api.put(`/api/sports/update-sport/${id}`, data),
  deleteSport: (id) => api.delete(`/api/sports/delete-sport/${id}`),
  getSportsStats: () => api.get('/api/sports/stats/overview'), // Fixed route
};