// routes/sportRoutes.js
const express = require('express');
const {
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
  getSportsStats,
  getSportsByStatus
} = require('../controllers/sportControllers');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes (no authentication needed for viewing)
router.get('/', getAllSports);
router.get('/status/:status', getSportsByStatus);
router.get('/:id', getSportById);

// Protected admin routes
router.use(protect);
router.get('/stats/overview', authorize('admin'), getSportsStats);
router.post('/create-sport', authorize('admin'), createSport);
router.put('/update-sport/:id', authorize('admin'), updateSport);
router.delete('/delete-sport/:id', authorize('admin'), deleteSport);

module.exports = router;