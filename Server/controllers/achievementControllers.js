// controllers/achievementControllers.js
const Achievement = require('../models/Achievement');
const mongoose = require('mongoose');
const ImageKitService = require('../services/imagekitService');
const upload = require('../middleware/uploadMiddleware');

// Helper function to handle file upload
const handleFileUpload = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, function (err) {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new Error('File size too large. Maximum size is 10MB.'));
        } else if (err.message.includes('Only image files')) {
          reject(new Error('Only image files are allowed!'));
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
};

// @desc    Create new achievement
// @route   POST /api/achievements/create-achievement
// @access  Private/Admin
exports.createAchievement = async (req, res) => {
  try {
    console.log('🟢 [Create Achievement] Starting...');
    
    // Handle file upload first
    await handleFileUpload(req, res);
    
    console.log('📦 Request body:', req.body);
    console.log('🖼️ Uploaded file:', req.file ? `File received: ${req.file.originalname}` : 'No file');
    
    // Security Check
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user ID not found.'
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
    
    // Required Fields Check
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
    
    // Handle image upload to ImageKit
    let imageData = {
      url: '/uploads/achievements/default-achievement.jpg',
      fileId: null
    };
    
    if (req.file) {
      try {
        imageData = await ImageKitService.uploadImage(req.file, 'achievements');
        console.log('✅ Image uploaded to ImageKit:', imageData);
      } catch (uploadError) {
        console.error('❌ ImageKit upload failed:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload image. Check ImageKit configuration.'
        });
      }
    }
    
    // Create Mongoose Document
    const achievement = new Achievement({
      title,
      student,
      grade: grade || 'N/A',
      award,
      category,
      date,
      venue: venue || 'N/A',
      description: description || '',
      image: imageData.url,
      imageKitFileId: imageData.fileId,
      highlight: highlight === 'true' || false,
      createdBy: req.user.userId
    });
    
    const savedAchievement = await achievement.save();
    
    console.log('✅ Achievement created successfully:', savedAchievement._id);
    
    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: savedAchievement
    });
  } catch (error) {
    console.error('❌ Create achievement FATAL error:', error);
    
    // Handle specific client-side errors
    if (error.message.includes('File size too large') || error.message.includes('Only image files')) {
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
    console.log('🟢 [Update Achievement] Starting for ID:', req.params.id);
    
    // Handle file upload first
    await handleFileUpload(req, res);
    
    console.log('📦 Update request body:', req.body);
    console.log('🖼️ Uploaded file:', req.file ? 'File received' : 'No file');
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID format'
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
      try {
        // Delete old image from ImageKit if exists
        if (achievement.imageKitFileId) {
          await ImageKitService.deleteImage(achievement.imageKitFileId);
        }
        
        // Upload new image to ImageKit
        const imageData = await ImageKitService.uploadImage(req.file, 'achievements');
        updateData.image = imageData.url;
        updateData.imageKitFileId = imageData.fileId;
        
        console.log('✅ New image uploaded to ImageKit:', imageData);
      } catch (uploadError) {
        console.error('❌ ImageKit upload failed:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload new image'
        });
      }
    }
    
    achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    console.log('✅ Achievement updated successfully');
    
    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    console.error('❌ Update achievement error:', error);
    
    // Handle specific errors
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
    console.log('🟢 [Delete Achievement] Starting for ID:', req.params.id);
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID format'
      });
    }
    
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    // Delete image from ImageKit if exists
    if (achievement.imageKitFileId) {
      await ImageKitService.deleteImage(achievement.imageKitFileId);
    }
    
    await Achievement.findByIdAndDelete(req.params.id);
    
    console.log('✅ Achievement deleted successfully');
    
    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('❌ Delete achievement error:', error);
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

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAllAchievements = async (req, res) => {
  try {
    console.log('🟢 [Get All Achievements] Fetching...');
    const achievements = await Achievement.find({}).sort({ date: -1 });
    
    console.log(`✅ Found ${achievements.length} achievements`);
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('❌ Get all achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievements'
    });
  }
};

// @desc    Get single achievement by ID
// @route   GET /api/achievements/:id
// @access  Public
exports.getAchievementById = async (req, res) => {
  try {
    console.log('🔍 [Get Achievement] Fetching with ID:', req.params.id);
    
    // Validate ID format
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('❌ Invalid ID format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID format'
      });
    }

    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      console.log('❌ Achievement not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    console.log('✅ Achievement found:', achievement.title);
    
    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    console.error('❌ Get achievement by ID error:', error);
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

// @desc    Get achievements by category
// @route   GET /api/achievements/category/:category
// @access  Public
exports.getAchievementsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    console.log('🔍 [Get by Category] Fetching:', category);
    
    const achievements = await Achievement.find({ category }).sort({ date: -1 });
    
    console.log(`✅ Found ${achievements.length} achievements in ${category}`);
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('❌ Get achievements by category error:', error);
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
    console.log('🔍 [Get Highlighted] Fetching...');
    
    const achievements = await Achievement.find({ highlight: true }).sort({ date: -1 }).limit(10);
    
    console.log(`✅ Found ${achievements.length} highlighted achievements`);
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('❌ Get highlighted achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching highlighted achievements'
    });
  }
};

// @desc    Get achievement statistics overview
// @route   GET /api/achievements/stats/overview
// @access  Private/Admin
exports.getAchievementStats = async (req, res) => {
  try {
    console.log('📊 [Get Stats] Fetching...');
    
    const totalAchievements = await Achievement.countDocuments();
    const highlighted = await Achievement.countDocuments({ highlight: true });
    
    // Group achievements by category and count them
    const achievementsByCategory = await Achievement.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    // Get the most recent achievement date
    const mostRecent = await Achievement.findOne().sort({ date: -1 }).select('title date student');
    
    console.log('✅ Stats fetched successfully');
    
    res.status(200).json({
      success: true,
      data: {
        total: totalAchievements,
        highlighted: highlighted,
        achievementsByCategory,
        mostRecent
      }
    });
  } catch (error) {
    console.error('❌ Get achievement stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievement stats'
    });
  }
};