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

const router=express.Router();
router.use(protect);


//public Routes
router.get('/', getAllSports);
router.get('/status/:status', getSportsByStatus);
router.get('/:id', getSportById);

// Admin only routes
router.get('/', authorize('admin'), getAllSports);
router.get('/status/overview', authorize('admin'), getSportsStats);
router.post('/create-sport', authorize('admin'), createSport);
router.put('/update-sport/:id', authorize('admin'), updateSport);
router.delete('/delete-sport/:id', authorize('admin'), deleteSport);

module.exports = router;