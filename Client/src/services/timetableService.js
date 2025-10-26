// services/timetableService.js
import { api } from './api';

export const timetableService = {
  getAllGrades: () => api.get('/api/timetable/grades'),
  
  updateTimetableSlot: (data) => api.post('/api/timetable/update-slot', data),
  
  clearTimetableSlot: (data) => api.post('/api/timetable/clear-slot', data),
  
  getTimetableByGrade: (grade) => api.get(`/api/timetable/grade/${grade}`),
  
  createGrade: (data) => api.post('/api/timetable/create-grade', data),
  
  getAllSubjects: () => api.get('/api/timetable/subjects'),
  
  createSubject: (data) => api.post('/api/timetable/create-subject', data),
  
  getTimetableStats: () => api.get('/api/timetable/stats'),
  
  deleteGrade: (grade) => api.delete(`/api/timetable/grade/${grade}`),
  
  createDefaultGrades: () => api.post('/api/timetable/create-default-grades')
};