// controllers/announcementControllers.js
const Announcement = require('../models/Announcement');

// @desc    Get all announcements (with filtering and pagination)
// @route   GET /api/announcements
// @access  Public
exports.getAllAnnouncements = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      active = 'true',
      audience 
    } = req.query;
    
    let query = {};
    
    // Filter by active status
    if (active === 'true') {
      query.isActive = true;
      query.expiryDate = { $gte: new Date() };
    }
    
    // Filter by target audience
    if (audience && audience !== 'all') {
      query.targetAudience = { $in: [audience, 'all'] };
    }
    
    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email')
      .select('-__v');
    
    const total = await Announcement.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: announcements.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: announcements
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching announcements'
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email')
      .select('-__v');
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Get announcement error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching announcement'
    });
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements/create-announcement
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
  try {
    console.log('Create announcement request body:', req.body);
    
    // Safety check: ensure the user ID is present
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user ID not found'
      });
    }

    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty'
      });
    }

    const {
      title,
      description,
      priority = 'medium',
      targetAudience = ['all'],
      expiryDate
    } = req.body;
    
    // Check required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required fields'
      });
    }
    
    // Check for duplicate active announcement with same title
    const existingAnnouncement = await Announcement.findOne({
      title,
      isActive: true,
      expiryDate: { $gte: new Date() }
    });
    
    if (existingAnnouncement) {
      return res.status(400).json({
        success: false,
        message: 'Active announcement with same title already exists'
      });
    }
    
    const announcementData = {
      title,
      description,
      priority,
      targetAudience: Array.isArray(targetAudience) ? targetAudience : [targetAudience],
      createdBy: req.user.userId
    };
    
    // Add expiry date if provided
    if (expiryDate) {
      announcementData.expiryDate = new Date(expiryDate);
    }
    
    const announcement = new Announcement(announcementData);
    const savedAnnouncement = await announcement.save();
    
    // Populate createdBy field in response
    await savedAnnouncement.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: savedAnnouncement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating announcement'
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/update-announcement/:id
// @access  Private/Admin
exports.updateAnnouncement = async (req, res) => {
  try {
    console.log('Update announcement request body:', req.body);
    console.log('Update ID:', req.params.id);
    
    const {
      title,
      description,
      priority,
      targetAudience,
      isActive,
      expiryDate
    } = req.body;
    
    let announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Check for duplicate (excluding current announcement)
    if (title && title !== announcement.title) {
      const duplicateAnnouncement = await Announcement.findOne({
        title,
        isActive: true,
        expiryDate: { $gte: new Date() },
        _id: { $ne: req.params.id }
      });
      
      if (duplicateAnnouncement) {
        return res.status(400).json({
          success: false,
          message: 'Active announcement with same title already exists'
        });
      }
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (targetAudience) updateData.targetAudience = Array.isArray(targetAudience) ? targetAudience : [targetAudience];
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (expiryDate) updateData.expiryDate = new Date(expiryDate);
    
    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email').select('-__v');
    
    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
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
        message: 'Invalid announcement ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating announcement'
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/delete-announcement/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    await Announcement.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting announcement'
    });
  }
};

// @desc    Get active announcements (for notification system)
// @route   GET /api/announcements/active/all
// @access  Public
exports.getActiveAnnouncements = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const announcements = await Announcement.find({
      isActive: true,
      expiryDate: { $gte: new Date() }
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .select('title description createdAt')
    .lean();
    
    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    console.error('Get active announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active announcements'
    });
  }
};

// @desc    Get announcement statistics
// @route   GET /api/announcements/stats/overview
// @access  Private/Admin
exports.getAnnouncementStats = async (req, res) => {
  try {
    const totalAnnouncements = await Announcement.countDocuments();
    const activeAnnouncements = await Announcement.countDocuments({
      isActive: true,
      expiryDate: { $gte: new Date() }
    });
    const expiredAnnouncements = await Announcement.countDocuments({
      expiryDate: { $lt: new Date() }
    });
    
    const announcementsByPriority = await Announcement.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const recentAnnouncements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt isActive')
      .populate('createdBy', 'name');
    
    res.status(200).json({
      success: true,
      data: {
        total: totalAnnouncements,
        active: activeAnnouncements,
        expired: expiredAnnouncements,
        byPriority: announcementsByPriority,
        recent: recentAnnouncements
      }
    });
  } catch (error) {
    console.error('Get announcement stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching announcement statistics'
    });
  }
};

// @desc    Toggle announcement status
// @route   PATCH /api/announcements/toggle-status/:id
// @access  Private/Admin
exports.toggleAnnouncementStatus = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    announcement.isActive = !announcement.isActive;
    await announcement.save();
    
    await announcement.populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'} successfully`,
      data: announcement
    });
  } catch (error) {
    console.error('Toggle announcement status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while toggling announcement status'
    });
  }
};