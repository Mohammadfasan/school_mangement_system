import {api} from './api';

export const announcementService = {
  // Public routes
  getAllAnnouncements: () => api.get('/api/announcements'),
  getActiveAnnouncements: () => api.get('/api/announcements/active/all'),
  getAnnouncementById: (id) => api.get(`/api/announcements/${id}`),
  
  // Admin routes
  createAnnouncement: (data) => api.post('/api/announcements/create-announcement', data),
  updateAnnouncement: (id, data) => api.put(`/api/announcements/update-announcement/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/api/announcements/delete-announcement/${id}`),
  toggleAnnouncementStatus: (id) => api.patch(`/api/announcements/toggle-status/${id}`),
  getAnnouncementStats: () => api.get('/api/announcements/stats/overview'),
};