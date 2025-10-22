// routes/timetableRoutes.js
const express = require('express');
const {
  getAllGrades,
  getGradeTimetable,
  updateTimetableSlot,
  createGrade,
  getAllSubjects,
  createSubject,
  clearTimetableSlot
} = require('../controllers/timetableControllers.js');
const { protect } = require('../middleware/auth.js');
const { isAdmin } = require('../middleware/roleMiddleware.js');

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

module.exports = router;