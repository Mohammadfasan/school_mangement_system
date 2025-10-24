const Sport = require('../models/Sport');

// @desc    Get all sports events
// @route   GET /api/sports
// @access  Public
exports.getAllSports = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
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

// @desc    Get single sport event
// @route   GET /api/sports/:id
// @access  Public
exports.getSportById = async (req, res) => {
  try {
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

// @desc    Create new sport event
// @route   POST /api/sports
// @access  Private/Admin
exports.createSport = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      date,
      time,
      venue,
      participatingTeam,
      chiefGuest,
      status,
      details,
      image,
      colorCode
    } = req.body;
    
    // Check if event with same title and date already exists
    const existingSport = await Sport.findOne({
      title,
      date: new Date(date)
    });
    
    if (existingSport) {
      return res.status(400).json({
        success: false,
        message: 'Sport event with same title and date already exists'
      });
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
      image: image || '',
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
    console.error('Create sport error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating sport event'
    });
  }
};

// @desc    Update sport event
// @route   PUT /api/sports/:id
// @access  Private/Admin
exports.updateSport = async (req, res) => {
  try {
    let sport = await Sport.findById(req.params.id);
    
    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport event not found'
      });
    }
    
    // Check if event with same title and date already exists (excluding current one)
    if (req.body.title && req.body.date) {
      const existingSport = await Sport.findOne({
        title: req.body.title,
        date: new Date(req.body.date),
        _id: { $ne: req.params.id }
      });
      
      if (existingSport) {
        return res.status(400).json({
          success: false,
          message: 'Sport event with same title and date already exists'
        });
      }
    }
    
    // Convert date string to Date object if provided
    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }
    
    sport = await Sport.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Sport event updated successfully',
      data: sport
    });
  } catch (error) {
    console.error('Update sport error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating sport event'
    });
  }
};

// @desc    Delete sport event
// @route   DELETE /api/sports/:id
// @access  Private/Admin
exports.deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    
    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport event not found'
      });
    }
    
    await Sport.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Sport event deleted successfully',
      data: {}
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
      }
    ]);
    
    // Get recent events
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