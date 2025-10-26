// routes/eventRoutes.js
const express = require('express');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByStatus,
  getEventsByCategory,
  getEventsStats
} = require('../controllers/eventControllers');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/status/:status', getEventsByStatus);
router.get('/category/:category', getEventsByCategory);
router.get('/:id', getEventById);

// Protected admin routes
router.use(protect);
router.post('/create-event', authorize('admin'), createEvent);
router.put('/update-event/:id', authorize('admin'), updateEvent);
router.delete('/delete-event/:id', authorize('admin'), deleteEvent);
router.get('/stats/overview', authorize('admin'), getEventsStats);

module.exports = router;