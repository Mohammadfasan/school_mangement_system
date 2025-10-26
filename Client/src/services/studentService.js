// services/studentService.js
import { api } from './api';

export const studentService = {
  // Admin routes
  getAllStudents: () => api.get('/api/students'),
  getStudentStatistics: () => api.get('/api/students/statistics'),
  createStudent: (data) => api.post('/api/students/create-student', data),
  getStudentsByGrade: (grade) => api.get(`/api/students/grade/${grade}`),
  
  // Shared routes
  getStudentById: (id) => api.get(`/api/students/${id}`),
  updateStudent: (id, data) => api.put(`/api/students/update-student/${id}`, data),
  deleteStudent: (id) => api.delete(`/api/students/delete-student/${id}`),
};