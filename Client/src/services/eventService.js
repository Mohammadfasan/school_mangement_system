// services/eventService.js
import { api } from './api';

// Image compression helper function
const compressImage = (base64String, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert back to base64 with reduced quality
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      console.log(`Image compressed from ${base64String.length} to ${compressedBase64.length} bytes`);
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      console.warn('Image compression failed, using original');
      resolve(base64String);
    };
  });
};

// Check if base64 string is too large and compress if needed
const optimizeImage = async (base64String) => {
  if (!base64String) return base64String;
  
  // If image is larger than 3MB, compress it
  if (base64String.length > 3 * 1024 * 1024) {
    console.log('Compressing large image...');
    return await compressImage(base64String);
  }
  
  return base64String;
};

export const eventService = {
  // Public routes
  getAllEvents: () => api.get('/api/events'),
  getEventsByStatus: (status) => api.get(`/api/events/status/${status}`),
  getEventsByCategory: (category) => api.get(`/api/events/category/${category}`),
  getEventById: (id) => api.get(`/api/events/${id}`),
  
  // Admin routes with image optimization
  createEvent: async (data) => {
    try {
      console.log('Creating event with data:', { 
        title: data.title,
        imageSize: data.image ? data.image.length : 0 
      });
      
      // Optimize image before sending
      const optimizedData = { ...data };
      if (optimizedData.image) {
        optimizedData.image = await optimizeImage(optimizedData.image);
        console.log('After compression - image size:', optimizedData.image.length);
      }
      
      return api.post('/api/events/create-event', optimizedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error in createEvent service:', error);
      throw error;
    }
  },
  
  updateEvent: async (id, data) => {
    try {
      console.log('Updating event with data:', { 
        id,
        title: data.title,
        imageSize: data.image ? data.image.length : 0 
      });
      
      // Optimize image before sending
      const optimizedData = { ...data };
      if (optimizedData.image) {
        optimizedData.image = await optimizeImage(optimizedData.image);
        console.log('After compression - image size:', optimizedData.image.length);
      }
      
      return api.put(`/api/events/update-event/${id}`, optimizedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error in updateEvent service:', error);
      throw error;
    }
  },
  
  deleteEvent: (id) => api.delete(`/api/events/delete-event/${id}`),
  getEventsStats: () => api.get('/api/events/stats/overview'),
};