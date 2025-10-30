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

// --- ADDED ---
// Import your file upload middleware
// (Adjust the path if necessary)
const upload = require('../middleware/uploadMiddleware');
// --- END ---

const router = express.Router();

// Public routes (no authentication needed for viewing)
router.get('/', getAllSports);
router.get('/status/:status', getSportsByStatus);
router.get('/:id', getSportById); // Keep this one last for public routes

// Protected admin routes
router.use(protect);
router.get('/stats/overview', authorize('admin'), getSportsStats);

// --- MODIFIED ---
// Add the 'upload.single('image')' middleware
// The 'image' string must match the key in your FormData
router.post(
  '/create-sport', 
  authorize('admin'), 
  upload.single('image'), 
  createSport
);
router.put(
  '/update-sport/:id', 
  authorize('admin'), 
  upload.single('image'), 
  updateSport
);
// --- END ---

router.delete('/delete-sport/:id', authorize('admin'), deleteSport);

module.exports = router;