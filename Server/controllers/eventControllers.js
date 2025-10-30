// controllers/eventControllers.js
const Event = require('../models/Event');
const mongoose = require('mongoose'); // Added for ID validation
const ImageKitService = require('../services/imagekitService'); // Added
const upload = require('../middleware/uploadMiddleware'); // Added

// --- REMOVED ---
// const path = require('path');
// const fs = require('fs');
// const saveBase64Image = (...) helper function

// --- ADDED ---
// Helper function to handle file upload (copied from achievementControllers.js)
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
    // Added ID validation
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

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
  } catch (error) { // <-- ***FIXED: Added { here***
    // Added CastError handling
    console.error('Get event by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }
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
    console.log('🟢 [Create Event] Starting...');

    // 1. Handle file upload first
    await handleFileUpload(req, res);

    console.log('📦 Request body:', req.body);
    console.log('🖼️ Uploaded file:', req.file ? `File received: ${req.file.originalname}` : 'No file');

    // 2. Security Check
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user ID not found.'
      });
    }

    const {
      title,
      student, // Note: This field was in your original code, kept it.
      award,   // Note: This field was in your original code, kept it.
      category,
      date,
      venue,
      description,
      status,
      audience,
      organizer,
      time
    } = req.body;
    // 'image' is now in req.file, not req.body

    // 3. Required Fields Check (adjust as needed)
    if (!title || !category || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, category, date, venue'
      });
    }

    // 4. Handle image upload to ImageKit
    let imageData = {
      url: '/uploads/events/default-event.jpg', // Provide a path to your default event image
      fileId: null
    };

    if (req.file) {
      try {
        imageData = await ImageKitService.uploadImage(req.file, 'events'); // Upload to 'events' folder
        console.log('✅ Image uploaded to ImageKit:', imageData);
      } catch (uploadError) {
        console.error('❌ ImageKit upload failed:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload image. Check ImageKit configuration.'
        });
      }
    }

    // 5. Calculate days_left
    let calculatedDaysLeft = 0;
    if (date) {
      const eventDate = new Date(date);
      const today = new Date();
      const diffTime = eventDate - today;
      calculatedDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedDaysLeft = calculatedDaysLeft > 0 ? calculatedDaysLeft : 0;
    }

    // 6. Create Mongoose Document
    const eventData = {
      title,
      student,
      award,
      category: category || 'General', // Default category
      date: new Date(date),
      venue,
      description: description || '',
      status: status || 'upcoming',
      audience: audience || 'All Students',
      organizer: organizer || 'School Administration',
      time: time || '',
      days_left: calculatedDaysLeft,
      createdBy: req.user.userId,
      image: imageData.url,
      imageKitFileId: imageData.fileId // <-- IMPORTANT: Add this to your Event model
    };

    const event = new Event(eventData);
    const savedEvent = await event.save();

    // 7. Populate createdBy for the response
    await savedEvent.populate('createdBy', 'name email');

    console.log('✅ Event created successfully:', savedEvent._id);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent
    });
  } catch (error) {
    console.error('❌ Create event FATAL error:', error);

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
      message: 'Server error while creating event'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/update-event/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    console.log('🟢 [Update Event] Starting for ID:', req.params.id);

    // 1. Handle file upload
    await handleFileUpload(req, res);

    console.log('📦 Update request body:', req.body);
    console.log('🖼️ Uploaded file:', req.file ? 'File received' : 'No file');

    // 2. Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    // 3. Find existing event
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
      status,
      audience,
      organizer,
      time
    } = req.body;

    // 4. Calculate days_left if date is being updated
    let calculatedDaysLeft = event.days_left;
    if (date) {
      const eventDate = new Date(date);
      const today = new Date();
      const diffTime = eventDate - today;
      calculatedDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedDaysLeft = calculatedDaysLeft > 0 ? calculatedDaysLeft : 0;
    }

    // 5. Prepare update data
    const updateData = {
      title,
      student,
      award,
      category,
      date: date ? new Date(date) : undefined,
      venue,
      description,
      status,
      audience,
      organizer,
      time,
      days_left: calculatedDaysLeft,
      updatedAt: Date.now()
    };

    // 6. Update image only if a new file was uploaded
    if (req.file) {
      try {
        // Delete old image from ImageKit if it exists
        if (event.imageKitFileId) {
          await ImageKitService.deleteImage(event.imageKitFileId);
        }

        // Upload new image to ImageKit
        const imageData = await ImageKitService.uploadImage(req.file, 'events');
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

    // 7. Perform the update
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateData }, // Use $set to only update provided fields
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');

    console.log('✅ Event updated successfully');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('❌ Update event error:', error);

    // Handle specific errors
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

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
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
    console.log('🟢 [Delete Event] Starting for ID:', req.params.id);

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    // 2. Find the event
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // 3. Delete image from ImageKit if exists
    if (event.imageKitFileId) {
      try {
        await ImageKitService.deleteImage(event.imageKitFileId);
        console.log('✅ Deleted image from ImageKit');
      } catch (imageError) {
        console.error('❌ Failed to delete image from ImageKit, but proceeding with DB delete:', imageError);
        // We still proceed to delete the event from the DB
      }
    }

    // 4. Delete from database
    await Event.findByIdAndDelete(req.params.id);

    console.log('✅ Event deleted successfully from DB');

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('❌ Delete event error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }
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
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
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
    res.status(500).json({ // <-- ***FIXED: Corrected 5T00 to 500***
      success: false,
      message: 'Server error while fetching events statistics'
    });
  }
};