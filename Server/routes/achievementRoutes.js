// routes/achievementRoutes.js
const express = require('express');
const {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getAchievementsByCategory,
  getHighlightedAchievements,
  getAchievementStats
} = require('../controllers/achievementControllers');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes - put specific routes first
router.get('/', getAllAchievements);
router.get('/category/:category', getAchievementsByCategory);
router.get('/highlighted/all', getHighlightedAchievements);

// Protected admin routes
router.post('/create-achievement', protect, authorize('admin'), createAchievement);
router.put('/update-achievement/:id', protect, authorize('admin'), updateAchievement);
router.delete('/delete-achievement/:id', protect, authorize('admin'), deleteAchievement);
router.get('/stats/overview', protect, authorize('admin'), getAchievementStats);

// Keep this LAST to avoid catching other routes
router.get('/:id', getAchievementById);

module.exports = router;