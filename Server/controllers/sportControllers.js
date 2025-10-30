// controllers/sportControllers.js
const Sport = require('../models/Sport');
const mongoose = require('mongoose');
const ImageKitService = require('../services/imagekitService');

exports.createSport = async (req, res) => {
  try {
    console.log('🟢 [Create Sport] Starting...');
    
   
    console.log('📦 [Create Sport] Request body:', req.body);
    console.log('🖼️ [Create Sport] File:', req.file ? `File received: ${req.file.originalname}` : 'No file');
    
    const {
      title, type, category, date, time, venue,
      participatingTeam, chiefGuest, status, details, colorCode
    } = req.body;

    // Check for existing sport
    const existingSport = await Sport.findOne({ title, date: new Date(date) });
    if (existingSport) {
      console.warn('🟡 [Create Sport] Conflict: Event with same title and date exists.');
      return res.status(409).json({
        success: false,
        message: 'Sport event with same title and date already exists'
      });
    }

    let imageUrl = '';
    let imageFileId = null;

    if (req.file) {
      try {
        console.log('🚀 [Create Sport] Uploading image to ImageKit...');
        const imageUploadResult = await ImageKitService.uploadImage(
          req.file, // Pass the entire file object
          'sports'  // Folder name
        );
        imageUrl = imageUploadResult.url;
        imageFileId = imageUploadResult.fileId;
        console.log('✅ [Create Sport] Image uploaded successfully');
      } catch (uploadError) {
        console.error('❌ [Create Sport] Image upload failed:', uploadError);
        return res.status(400).json({
          success: false,
          message: `Image upload failed: ${uploadError.message}`
        });
      }
    }
    
    const sport = await Sport.create({
      title,
      type,
      category: category || 'outdoor',
      date: new Date(date),
      time,
      venue,
      participatingTeam,
      chiefGuest: chiefGuest || '',
      status: status || 'upcoming',
      details: details || '',
      image: imageUrl,
      imageFileId: imageFileId,
      colorCode: colorCode || '#059669',
      createdBy: req.user.userId
    });
    
    await sport.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Sport event created successfully',
      data: sport
    });
  } catch (error) {
    console.error('🔴 [Create Sport] Error:', error);

    // ADDED: Handle multer errors (like file size) that bubble up from the route
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.',
      });
    }
    if (error.message && error.message.includes('Only image files')) {
       return res.status(400).json({
        success: false,
        message: 'Only image files are allowed!',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating sport event'
    });
  }
};

// @desc    Update sport event
// @route   PUT /api/sports/update-sport/:id
// @access  Private/Admin
exports.updateSport = async (req, res) => {
  try {
    console.log(`🟢 [Update Sport] Starting for ID: ${req.params.id}`);
    
    // Handle file upload
    // await handleFileUpload(req, res); // <-- REMOVED: This line is deleted
    
    // req.body and req.file are already populated by the middleware in sportRoutes.js
    console.log('📦 [Update Sport] Request body:', req.body);
    console.log('🖼️ [Update Sport] File:', req.file ? `File received: ${req.file.originalname}` : 'No new file');
    
    const sport = await Sport.findById(req.params.id);
    if (!sport) {
      console.warn(`🟡 [Update Sport] Not Found: ID ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Sport event not found'
      });
    }
    
    // Get text data
    const updateData = { ...req.body };
    
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Handle Image Update
    if (req.file) {
      try {
        console.log('🚀 [Update Sport] New image provided. Uploading to ImageKit...');
        const imageUploadResult = await ImageKitService.uploadImage(
          req.file, // Pass the entire file object
          'sports'  // Folder name
        );
        
        updateData.image = imageUploadResult.url;
        updateData.imageFileId = imageUploadResult.fileId;
        console.log('✅ [Update Sport] New image uploaded successfully');

        // If there was an old image, delete it from ImageKit
        if (sport.imageFileId) {
          console.log(`🗑️ [Update Sport] Deleting old image: ${sport.imageFileId}`);
          await ImageKitService.deleteImage(sport.imageFileId);
        }
      } catch (uploadError) {
        console.error('❌ [Update Sport] Image upload failed:', uploadError);
        return res.status(400).json({
          success: false,
          message: `Image upload failed: ${uploadError.message}`
        });
      }
    } else if (updateData.image === 'null' || updateData.image === '') {
      // Handle explicit image removal
      console.log('🗑️ [Update Sport] Image removal requested.');
      if (sport.imageFileId) {
        await ImageKitService.deleteImage(sport.imageFileId);
      }
      updateData.image = '';
      updateData.imageFileId = null;
    }

    const updatedSport = await Sport.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Sport event updated successfully',
      data: updatedSport
    });
  } catch (error) {
    console.error('🔴 [Update Sport] Error:', error);

    // ADDED: Handle multer errors (like file size) that bubble up from the route
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.',
      });
    }
     if (error.message && error.message.includes('Only image files')) {
       return res.status(400).json({
        success: false,
        message: 'Only image files are allowed!',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating sport event'
    });
  }
};

// @desc    Delete sport event
// @route   DELETE /api/sports/delete-sport/:id
// @access  Private/Admin
exports.deleteSport = async (req, res) => {
  try {
    console.log(`🟢 [Delete Sport] Starting for ID: ${req.params.id}`);
    
    const sport = await Sport.findById(req.params.id);
    if (!sport) {
      console.warn(`🟡 [Delete Sport] Not Found: ID ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Sport event not found'
      });
    }

    // Delete image from ImageKit before deleting the DB record
    if (sport.imageFileId) {
      console.log(`🗑️ [Delete Sport] Deleting image from ImageKit: ${sport.imageFileId}`);
      await ImageKitService.deleteImage(sport.imageFileId);
    }

    await Sport.findByIdAndDelete(req.params.id);
    
    console.log(`✅ [Delete Sport] Successfully deleted record: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Sport event deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('🔴 [Delete Sport] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting sport event'
    });
  }
};

// Other functions remain the same...
exports.getAllSports = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    
    const sports = await Sport.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Sport.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: sports.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: sports
    });
  } catch (error) {
    console.error('Get sports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sports events'
    });
  }
};

exports.getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id).populate('createdBy', 'name email');
      
    if (!sport) {
      return res.status(4404).json({ success: false, message: 'Sport event not found' });
    }
    
    res.status(200).json({ success: true, data: sport });
  } catch (error) {
    console.error('Get sport by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSportsStats = async (req, res) => {
  try {
    const totalEvents = await Sport.countDocuments();
    const upcomingEvents = await Sport.countDocuments({ status: 'upcoming' });
    const liveEvents = await Sport.countDocuments({ status: 'live' });
    const completedEvents = await Sport.countDocuments({ status: 'completed' });
    const cancelledEvents = await Sport.countDocuments({ status: 'cancelled' });
    
    const categoryStats = await Sport.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const recentEvents = await Sport.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');
      
    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        liveEvents,
        completedEvents,
        cancelledEvents,
        categoryStats,
        recentEvents
      }
    });
  } catch (error) {
    console.error('Get sports stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sports statistics'
    });
  }
};

exports.getSportsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const validStatuses = ['upcoming', 'live', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }
    
    const sports = await Sport.find({ status })
      .populate('createdBy', 'name email')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Sport.countDocuments({ status });
    
    res.status(200).json({
      success: true,
      count: sports.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: sports
    });
  } catch (error) {
    console.error('Get sports by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sports by status'
    });
  }
};