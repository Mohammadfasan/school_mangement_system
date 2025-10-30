// services/sportService.js
import { api } from './api';

// Named export use pannu
export const sportService = {
  // Public routes
  getAllSports: (params) => {
    return api.get('/api/sports', { params });
  },
  getSportsByStatus: (status) => api.get(`/api/sports/status/${status}`),
  getSportById: (id) => api.get(`/api/sports/${id}`),
  
  // Admin routes
  createSport: (data) => {
    return api.post('/api/sports/create-sport', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateSport: (id, data) => {
    return api.put(`/api/sports/update-sport/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteSport: (id) => api.delete(`/api/sports/delete-sport/${id}`),
  getSportsStats: () => api.get('/api/sports/stats/overview'),
};

