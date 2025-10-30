// services/achievementService.js
import { api } from './api';

export const achievementService = {
  // Public routes
  getAllAchievements: () => api.get('/api/achievements'),
  getAchievementsByCategory: (category) => api.get(`/api/achievements/category/${category}`),
  getHighlightedAchievements: () => api.get('/api/achievements/highlighted/all'),
  getAchievementById: (id) => api.get(`/api/achievements/${id}`),
  
  // Admin routes
  createAchievement: (data) => {
    return api.post('/api/achievements/create-achievement', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateAchievement: (id, data) => {
    return api.put(`/api/achievements/update-achievement/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteAchievement: (id) => api.delete(`/api/achievements/delete-achievement/${id}`),
  getAchievementStats: () => api.get('/api/achievements/stats/overview'),
};