// controllers/eventControllers.js
const Event = require('../models/Event');
const path = require('path');
const fs = require('fs');

// Helper function to handle base64 image
const saveBase64Image = (base64String, eventId) => {
  if (!base64String) return '';
  
  try {
    // Check if it's a base64 string or already a URL
    if (base64String.startsWith('data:image/')) {
      const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return '';
      }
      
      const imageType = matches[1];
      const imageData = matches[2];
      const buffer = Buffer.from(imageData, 'base64');
      
      // Create uploads directory if it doesn't exist
      const uploadDir = 'uploads/events';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filename = `event-${eventId || Date.now()}-${Math.random().toString(36).substring(7)}.${imageType.split('/')[1] || 'png'}`;
      const filepath = path.join(uploadDir, filename);
      
      fs.writeFileSync(filepath, buffer);
      return `/uploads/events/${filename}`;
    }
    
    // If it's already a URL, return as is
    return base64String;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    return '';
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({})
      .populate('createdBy', 'name email')
      .sort({ date: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
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
// @route   POST /api/events/create-event
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
      time
    } = req.body;
    
    // Calculate days_left
    let calculatedDaysLeft = 0;
    if (date) {
      const eventDate = new Date(date);
      const today = new Date();
      const diffTime = eventDate - today;
      calculatedDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedDaysLeft = calculatedDaysLeft > 0 ? calculatedDaysLeft : 0;
    }
    
    // Create event first to get ID for image naming
    const eventData = {
      title,
      student,
      award,
      category: category || 'Sport',
      date: new Date(date),
      venue,
      description: description || '',
      status: status || 'upcoming',
      audience: audience || 'All Students',
      organizer: organizer || 'School Administration',
      time: time || '',
      days_left: calculatedDaysLeft,
      createdBy: req.user.userId
    };
    
    const event = await Event.create(eventData);
    
    // Handle image after event creation to use event ID
    if (image) {
      const imagePath = saveBase64Image(image, event._id);
      if (imagePath) {
        event.image = imagePath;
        await event.save();
      }
    }
    
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
// @route   PUT /api/events/update-event/:id
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
      time
    } = req.body;
    
    // Calculate days_left if date is being updated
    let calculatedDaysLeft = event.days_left;
    if (date && !req.body.days_left) {
      const eventDate = new Date(date);
      const today = new Date();
      const diffTime = eventDate - today;
      calculatedDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedDaysLeft = calculatedDaysLeft > 0 ? calculatedDaysLeft : 0;
    }
    
    // Update event data
    event.title = title || event.title;
    event.student = student || event.student;
    event.award = award || event.award;
    event.category = category || event.category;
    event.date = date ? new Date(date) : event.date;
    event.venue = venue || event.venue;
    event.description = description || event.description;
    event.status = status || event.status;
    event.audience = audience || event.audience;
    event.organizer = organizer || event.organizer;
    event.time = time || event.time;
    event.days_left = calculatedDaysLeft;
    
    // Handle image update
    if (image && image !== event.image) {
      const imagePath = saveBase64Image(image, event._id);
      if (imagePath) {
        event.image = imagePath;
      }
    }
    
    await event.save();
    await event.populate('createdBy', 'name email');
    
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
// @route   DELETE /api/events/delete-event/:id
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
    
    const validStatuses = ['upcoming', 'completed', 'canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }
    
    const events = await Event.find({ status })
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
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
    
    const events = await Event.find({ category })
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
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