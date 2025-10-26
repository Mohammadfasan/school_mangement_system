// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentControllers');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes (no authentication needed)
router.get('/', studentController.getAllStudents);
router.get('/statistics', studentController.getStudentStatistics);
router.get('/grade/:grade', studentController.getStudentsByGrade);
router.get('/:id', studentController.getStudentById);

// Protected admin routes
router.use(protect);
router.post('/create-student', authorize('admin'), studentController.createStudent);
router.put('/update-student/:id', authorize('admin'), studentController.updateStudent);
router.delete('/delete-student/:id', authorize('admin'), studentController.deleteStudent);

module.exports = router;