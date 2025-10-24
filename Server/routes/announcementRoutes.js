// routes/announcementRoutes.js
const express = require('express');
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  getAnnouncementStats,
  toggleAnnouncementStatus
} = require('../controllers/announcementControllers');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllAnnouncements);
router.get('/active/all', getActiveAnnouncements);
router.get('/:id', getAnnouncementById);

// Protected routes (Admin only)
router.use(protect);
router.post('/create-announcement', authorize('admin'), createAnnouncement);
router.put('/update-announcement/:id', authorize('admin'), updateAnnouncement);
router.delete('/delete-announcement/:id', authorize('admin'), deleteAnnouncement);
router.patch('/toggle-status/:id', authorize('admin'), toggleAnnouncementStatus);
router.get('/stats/overview', authorize('admin'), getAnnouncementStats);

module.exports = router;