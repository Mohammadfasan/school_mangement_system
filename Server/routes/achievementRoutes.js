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

// Public routes
router.get('/', getAllAchievements);
router.get('/category/:category', getAchievementsByCategory);
router.get('/highlighted/all', getHighlightedAchievements);
router.get('/:id', getAchievementById);

// Protected routes (Admin only)
router.use(protect);
router.post('/create-achievement', authorize('admin'), createAchievement);
router.put('/update-achievement/:id', authorize('admin'), updateAchievement);
router.delete('/delete-achievement/:id', authorize('admin'), deleteAchievement);
router.get('/stats/overview', authorize('admin'), getAchievementStats);

module.exports = router;