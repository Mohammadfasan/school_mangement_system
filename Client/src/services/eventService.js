// services/eventService.js - Update to handle FormData
import { api } from './api';

export const eventService = {
  // Public routes
  getAllEvents: () => api.get('/api/events'),
  getEventsByStatus: (status) => api.get(`/api/events/status/${status}`),
  getEventsByCategory: (category) => api.get(`/api/events/category/${category}`),
  getEventById: (id) => api.get(`/api/events/${id}`),
  
  // Admin routes - Update these to handle FormData
  createEvent: (data) => api.post('/api/events/create-event', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  updateEvent: (id, data) => api.put(`/api/events/update-event/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteEvent: (id) => api.delete(`/api/events/delete-event/${id}`),
  getEventsStats: () => api.get('/api/events/stats/overview'),
};