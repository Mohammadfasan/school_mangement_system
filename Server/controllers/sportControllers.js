// controllers/sportControllers.js
const Sport = require('../models/Sport');
const mongoose = require('mongoose');
const ImageKitService = require('../services/imagekitService');

// @desc    Create new sport
// @route   POST /api/sports/create-sport
// @access  Private/Admin
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
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating sport event'
    });
  }
};

// @desc    Get all sports (with pagination and search)
// @route   GET /api/sports
// @access  Public
exports.getAllSports = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    const sports = await Sport.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Sport.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sports.length,
      page,
      pages: Math.ceil(total / limit),
      total,
      data: sports
    });
  } catch (error) {
    console.error('Get all sports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sports'
    });
  }
};

// @desc    Get single sport
// @route   GET /api/sports/:id
// @access  Public
exports.getSportById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid sport ID' });
    }
    
    const sport = await Sport.findById(req.params.id).populate('createdBy', 'name email');

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sport
    });
  } catch (error) {
    console.error('Get sport by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sport event'
    });
  }
};

// @desc    Update sport event
// @route   PUT /api/sports/update-sport/:id
// @access  Private/Admin
exports.updateSport = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid sport ID' });
    }

    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport event not found'
      });
    }
    
    let imageUrl = sport.image;
    let imageFileId = sport.imageFileId;

    // Handle new image upload
    if (req.file) {
      try {
        // Delete old image from ImageKit
        if (sport.imageFileId) {
          await ImageKitService.deleteImage(sport.imageFileId);
        }
        
        // Upload new image
        const imageUploadResult = await ImageKitService.uploadImage(req.file, 'sports');
        imageUrl = imageUploadResult.url;
        imageFileId = imageUploadResult.fileId;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: `Image update failed: ${uploadError.message}`
        });
      }
    }

    // Update fields
    const { title, type, category, date, time, venue, participatingTeam, chiefGuest, status, details, colorCode } = req.body;
    
    sport.title = title || sport.title;
    sport.type = type || sport.type;
    sport.category = category || sport.category;
    sport.date = date ? new Date(date) : sport.date;
    sport.time = time || sport.time;
    sport.venue = venue || sport.venue;
    sport.participatingTeam = participatingTeam || sport.participatingTeam;
    sport.chiefGuest = chiefGuest !== undefined ? chiefGuest : sport.chiefGuest;
    sport.status = status || sport.status;
    sport.details = details !== undefined ? details : sport.details;
    sport.colorCode = colorCode || sport.colorCode;
    sport.image = imageUrl;
    sport.imageFileId = imageFileId;
    
    const updatedSport = await sport.save();
    
    await updatedSport.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Sport event updated successfully',
      data: updatedSport
    });
  } catch (error) {
    console.error('Update sport error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating sport event'
    });
  }
};

// @desc    Delete sport event
// @route   DELETE /api/sports/delete-sport/:id
// @access  Private/Admin
exports.deleteSport = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid sport ID' });
    }
    
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport event not found'
      });
    }

    // Delete image from ImageKit
    if (sport.imageFileId) {
      try {
        await ImageKitService.deleteImage(sport.imageFileId);
      } catch (deleteError) {
        console.warn(`Could not delete image ${sport.imageFileId}: ${deleteError.message}`);
      }
    }
    
    await sport.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sport event deleted successfully'
    });
  } catch (error) {
    console.error('Delete sport error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting sport event'
    });
  }
};

// @desc    Get sports statistics
// @route   GET /api/sports/stats/overview
// @access  Private/Admin
exports.getSportsStats = async (req, res) => {
  try {
    const totalEvents = await Sport.countDocuments();
    const upcomingEvents = await Sport.countDocuments({ status: 'upcoming' });
    const liveEvents = await Sport.countDocuments({ status: 'live' });
    const completedEvents = await Sport.countDocuments({ status: 'completed' });
    const cancelledEvents = await Sport.countDocuments({ status: 'cancelled' });

    // Get events by category
    const categoryStats = await Sport.aggregate([
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

    // -----------------------------------------------------------------
    //  FIX: REMOVED THE SLOW QUERY THAT SCANNED THE ENTIRE COLLECTION
    //
    //  const recentEvents = await Sport.find()
    //    .sort({ createdAt: -1 })
    //    .limit(5)
    //    .populate('createdBy', 'name email');
    //
    // -----------------------------------------------------------------

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        liveEvents,
        completedEvents,
        cancelledEvents,
        categoryStats,
        // recentEvents // <-- This line is now removed
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

// @desc    Get sports by status
// @route   GET /api/sports/status/:status
// @access  Public
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
      page,
      pages: Math.ceil(total / limit),
      total,
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