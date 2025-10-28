// routes/notificationRoutes.js
const express = require('express');
const {
  getAllNotifications,
  getActiveNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  toggleNotificationStatus,
  getNotificationStats
} = require('../controllers/notificationControllers');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.get('/', getAllNotifications);
router.get('/active', getActiveNotifications);
router.get('/:id', getNotificationById);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);

// Admin routes
router.post('/create', authorize('admin'), createNotification);
router.put('/update/:id', authorize('admin'), updateNotification);
router.delete('/delete/:id', authorize('admin'), deleteNotification);
router.patch('/toggle-status/:id', authorize('admin'), toggleNotificationStatus);
router.get('/stats/overview', authorize('admin'), getNotificationStats);

module.exports = router;