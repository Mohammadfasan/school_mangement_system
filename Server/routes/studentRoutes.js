const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentControllers');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), studentController.getAllStudents);
router.get('/statistics', authorize('admin'), studentController.getStudentStatistics);
router.post('/create-student', authorize('admin'), studentController.createStudent);
router.get('/grade/:grade', authorize('admin'), studentController.getStudentsByGrade);

// Shared routes (admin can access all, users might have limited access)
router.get('/:id', studentController.getStudentById);
router.put('/update-student/:id', authorize('admin'), studentController.updateStudent);
router.delete('/delete-student/:id', authorize('admin'), studentController.deleteStudent);

module.exports = router;