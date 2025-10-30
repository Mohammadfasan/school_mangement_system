// services/eventService.js
import { api } from './api';

// --- REMOVED ---
// All Base64 image compression functions (compressImage, optimizeImage)
// are no longer needed as the server now handles file objects.

export const eventService = {
  // Public routes (unchanged)
  getAllEvents: () => api.get('/api/events'),
  getEventsByStatus: (status) => api.get(`/api/events/status/${status}`),
  getEventsByCategory: (category) => api.get(`/api/events/category/${category}`),
  getEventById: (id) => api.get(`/api/events/${id}`),
  

  createEvent: (data) => {
    // Removed all async/await compression logic
    // Now sends FormData directly, just like achievementService
    return api.post('/api/events/create-event', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
 
  updateEvent: (id, data) => {
    // Removed all async/await compression logic
    // Now sends FormData directly, just like achievementService
    return api.put(`/api/events/update-event/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Admin routes (unchanged)
  deleteEvent: (id) => api.delete(`/api/events/delete-event/${id}`),
  getEventsStats: () => api.get('/api/events/stats/overview'),
};