import { api } from './api';

export const authService = {
  signup: (userData) => api.post('/api/auth/signup', userData),
  signin: (credentials) => api.post('/api/auth/signin', credentials),
  getMe: () => api.get('/api/auth/me'),
  getAllUsers: () => api.get('/api/auth/users'),
  updateRole: (userId, roleData) => api.patch(`/api/auth/${userId}/role`, roleData),
};