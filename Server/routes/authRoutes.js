// routes/auth.js
const express = require('express');
const { 
  signup, 
  signin, 
  getMe, 
  updateRole, 
  getAllUsers 
} = require('../controllers/authControllers.js');
const { protect } = require('../middleware/auth.js');
const { authorize, isAdmin } = require('../middleware/roleMiddleware.js');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes (both admin and user can access)
router.get('/me', protect, getMe);

// Admin only routes
router.get('/users', protect, isAdmin, getAllUsers);
router.patch('/:userId/role', protect, isAdmin, updateRole);



module.exports = router;