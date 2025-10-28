
import { api } from './api';

export const notificationService = {
  // Public routes
  getAllNotifications: () => api.get('/api/notifications'),
  getActiveNotifications: () => api.get('/api/notifications/active'),
  getNotificationById: (id) => api.get(`/api/notifications/${id}`),
  
  // User notification routes
  getUserNotifications: () => api.get('/api/notifications/user/me'),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/api/notifications/read-all'),
  
  // Admin routes
  createNotification: (data) => api.post('/api/notifications/create', data),
  updateNotification: (id, data) => api.put(`/api/notifications/update/${id}`, data),
  deleteNotification: (id) => api.delete(`/api/notifications/delete/${id}`),
  toggleNotificationStatus: (id) => api.patch(`/api/notifications/toggle-status/${id}`),
  getNotificationStats: () => api.get('/api/notifications/stats/overview'),
};