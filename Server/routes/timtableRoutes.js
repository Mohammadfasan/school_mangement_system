// routes/timetableRoutes.js
const express = require('express');
const {
  getAllGrades,
  getGradeTimetable,
  updateTimetableSlot,
  createGrade,
  getAllSubjects,
  createSubject,
  clearTimetableSlot,
  createDefaultGrades,
  getTimetableStats,
  deleteGrade
} = require('../controllers/timetableControllers');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes (for student view)
router.get('/grades', getAllGrades);
router.get('/grade/:grade', getGradeTimetable);

// Protected admin routes
router.post('/update-slot', protect, isAdmin, updateTimetableSlot);
router.post('/clear-slot', protect, isAdmin, clearTimetableSlot);
router.post('/create-grade', protect, isAdmin, createGrade);
router.get('/subjects', protect, isAdmin, getAllSubjects);
router.post('/create-subject', protect, isAdmin, createSubject);
router.post('/create-default-grades', createDefaultGrades);
router.get('/stats', protect, isAdmin, getTimetableStats);
router.delete('/grade/:grade', protect, isAdmin, deleteGrade);

module.exports = router;