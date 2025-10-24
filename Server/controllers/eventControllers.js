const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { student: { $regex: search, $options: 'i' } },
        { award: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Event.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      student,
      award,
      category,
      date,
      venue,
      description,
      image,
      status,
      audience,
      organizer,
      days_left
    } = req.body;
    
    // Calculate days_left if not provided
    let calculatedDaysLeft = days_left;
    if (!days_left && date) {
      const eventDate = new Date(date);
      const today = new Date();
      const diffTime = eventDate - today;
      calculatedDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedDaysLeft = calculatedDaysLeft > 0 ? calculatedDaysLeft : 0;
    }
    
    const event = await Event.create({
      title,
      student,
      award,
      category: category || 'Sport',
      date: new Date(date),
      venue,
      description: description || '',
      image: image || '',
      status: status || 'upcoming',
      audience: audience || 'All Students',
      organizer: organizer || 'School Administration',
      days_left: calculatedDaysLeft || 0,
      createdBy: req.user.userId
    });
    
    await event.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Calculate days_left if date is being updated
    if (req.body.date && !req.body.days_left) {
      const eventDate = new Date(req.body.date);
      const today = new Date();
      const diffTime = eventDate - today;
      req.body.days_left = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      req.body.days_left = req.body.days_left > 0 ? req.body.days_left : 0;
    }
    
    // Convert date string to Date object if provided
    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }
    
    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
};

// @desc    Get events by status
// @route   GET /api/events/status/:status
// @access  Public
exports.getEventsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const validStatuses = ['upcoming', 'completed', 'canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }
    
    const events = await Event.find({ status })
      .populate('createdBy', 'name email')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Event.countDocuments({ status });
    
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: events
    });
  } catch (error) {
    console.error('Get events by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events by status'
    });
  }
};

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const events = await Event.find({ category })
      .populate('createdBy', 'name email')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Event.countDocuments({ category });
    
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: events
    });
  } catch (error) {
    console.error('Get events by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events by category'
    });
  }
};

// @desc    Get events statistics
// @route   GET /api/events/stats/overview
// @access  Private/Admin
exports.getEventsStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    const canceledEvents = await Event.countDocuments({ status: 'canceled' });
    
    // Get events by category
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent events
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');
    
    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        canceledEvents,
        categoryStats,
        recentEvents
      }
    });
  } catch (error) {
    console.error('Get events stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events statistics'
    });
  }
};