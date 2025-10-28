// controllers/achievementControllers.js
const Achievement = require('../models/Achievement');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads/achievements';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'achievement-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed'));
    }
  }
}).single('image');

// Helper function to handle file upload
const handleFileUpload = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, function (err) {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new Error('File size too large. Maximum size is 10MB.'));
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
};

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAllAchievements = async (req, res) => {
  try {
    const { category, highlight, page = 1, limit = 100 } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Filter by highlight
    if (highlight === 'true') {
      query.highlight = true;
    }
    
    const achievements = await Achievement.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email');
    
    const total = await Achievement.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: achievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievements'
    });
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    console.error('Get achievement error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievement'
    });
  }
};

// @desc    Create new achievement
// @route   POST /api/achievements/create-achievement
// @access  Private/Admin
exports.createAchievement = async (req, res) => {
  try {
    // Handle file upload first
    await handleFileUpload(req, res);
    
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    // Safety check: ensure the user ID is present
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user ID not found'
      });
    }

    const {
      title,
      student,
      grade,
      award,
      category,
      date,
      venue,
      description,
      highlight
    } = req.body;
    
    // Check required fields
    if (!title || !student || !award || !category || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, student, award, category, date'
      });
    }
    
    // Check if achievement already exists
    const existingAchievement = await Achievement.findOne({
      title,
      student,
      date
    });
    
    if (existingAchievement) {
      return res.status(400).json({
        success: false,
        message: 'Achievement with same title, student and date already exists'
      });
    }
    
    // Handle image path
    let imagePath = '/uploads/achievements/default-achievement.jpg';
    if (req.file) {
      imagePath = `/uploads/achievements/${req.file.filename}`;
    }
    
    const achievement = new Achievement({
      title,
      student,
      grade: grade || 'N/A',
      award,
      category,
      date,
      venue: venue || 'N/A',
      description: description || '',
      image: imagePath,
      highlight: highlight === 'true' || false,
      createdBy: req.user.userId
    });
    
    const savedAchievement = await achievement.save();
    
    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: savedAchievement
    });
  } catch (error) {
    console.error('Create achievement error:', error);
    
    // Handle file upload errors
    if (error.message.includes('File size too large')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('Only image files')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating achievement'
    });
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/update-achievement/:id
// @access  Private/Admin
exports.updateAchievement = async (req, res) => {
  try {
    // Handle file upload first
    await handleFileUpload(req, res);
    
    console.log('Update request body:', req.body);
    console.log('Update ID:', req.params.id);
    console.log('Uploaded file:', req.file);
    
    const {
      title,
      student,
      grade,
      award,
      category,
      date,
      venue,
      description,
      highlight
    } = req.body;
    
    let achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    // Check for duplicate (excluding current achievement)
    const duplicateAchievement = await Achievement.findOne({
      title,
      student,
      date,
      _id: { $ne: req.params.id }
    });
    
    if (duplicateAchievement) {
      return res.status(400).json({
        success: false,
        message: 'Achievement with same title, student and date already exists'
      });
    }
    
    // Prepare update data
    const updateData = {
      title,
      student,
      grade: grade || 'N/A',
      award,
      category,
      date,
      venue: venue || 'N/A',
      description: description || '',
      highlight: highlight === 'true' || false,
      updatedAt: Date.now()
    };
    
    // Update image only if a new file was uploaded
    if (req.file) {
      updateData.image = `/uploads/achievements/${req.file.filename}`;
    }
    
    achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Update achievement error:', error);
    
    // Handle file upload errors
    if (error.message.includes('File size too large')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('Only image files')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating achievement'
    });
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/delete-achievement/:id
// @access  Private/Admin
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    await Achievement.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete achievement error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting achievement'
    });
  }
};

// @desc    Get achievements by category
// @route   GET /api/achievements/category/:category
// @access  Public
exports.getAchievementsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 100 } = req.query;
    
    const achievements = await Achievement.find({ category })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email');
    
    const total = await Achievement.countDocuments({ category });
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: achievements
    });
  } catch (error) {
    console.error('Get achievements by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievements by category'
    });
  }
};

// @desc    Get highlighted achievements
// @route   GET /api/achievements/highlighted/all
// @access  Public
exports.getHighlightedAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ highlight: true })
      .sort({ date: -1 })
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('Get highlighted achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching highlighted achievements'
    });
  }
};

// @desc    Get achievement statistics
// @route   GET /api/achievements/stats/overview
// @access  Private/Admin
exports.getAchievementStats = async (req, res) => {
  try {
    const totalAchievements = await Achievement.countDocuments();
    const achievementsByCategory = await Achievement.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const highlightedCount = await Achievement.countDocuments({ highlight: true });
    const recentAchievements = await Achievement.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title student category date');
    
    res.status(200).json({
      success: true,
      data: {
        total: totalAchievements,
        byCategory: achievementsByCategory,
        highlighted: highlightedCount,
        recent: recentAchievements
      }
    });
  } catch (error) {
    console.error('Get achievement stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievement statistics'
    });
  }
};