// controllers/notificationControllers.js
const Notification = require('../models/Notification');

// @desc    Get all notifications (with filtering and pagination)
// @route   GET /api/notifications
// @access  Private
exports.getAllNotifications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      active = 'true',
      audience,
      type,
      unread = 'false'
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
    
    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Filter unread notifications for specific user
    if (unread === 'true') {
      query['readBy.user'] = { $ne: req.user.userId };
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email')
      .select('-__v');
    
    const total = await Notification.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
};

// @desc    Get active notifications for current user
// @route   GET /api/notifications/active
// @access  Private
exports.getActiveNotifications = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const notifications = await Notification.find({
      isActive: true,
      expiryDate: { $gte: new Date() },
      $or: [
        { targetAudience: 'all' },
        { targetAudience: req.user.role },
        { targetAudience: { $in: [req.user.role] } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('createdBy', 'name')
    .select('title message type createdAt isRead readBy')
    .lean();

    // Mark which notifications are unread for current user
    const notificationsWithReadStatus = notifications.map(notification => {
      const isReadByUser = notification.readBy.some(
        read => read.user && read.user.toString() === req.user.userId
      );
      
      return {
        ...notification,
        isRead: isReadByUser,
        readBy: undefined // Remove readBy from response
      };
    });

    // Filter only unread notifications
    const unreadNotifications = notificationsWithReadStatus.filter(notification => !notification.isRead);
    
    res.status(200).json({
      success: true,
      count: unreadNotifications.length,
      data: unreadNotifications
    });
  } catch (error) {
    console.error('Get active notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active notifications'
    });
  }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('readBy.user', 'name')
      .select('-__v');
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Get notification error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notification'
    });
  }
};

// @desc    Create new notification
// @route   POST /api/notifications/create
// @access  Private/Admin
exports.createNotification = async (req, res) => {
  try {
    console.log('Create notification request body:', req.body);
    
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user ID not found'
      });
    }

    const {
      title,
      message,
      type = 'info',
      priority = 'medium',
      targetAudience = ['all'],
      expiryDate
    } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required fields'
      });
    }
    
    const notificationData = {
      title,
      message,
      type,
      priority,
      targetAudience: Array.isArray(targetAudience) ? targetAudience : [targetAudience],
      createdBy: req.user.userId
    };
    
    if (expiryDate) {
      notificationData.expiryDate = new Date(expiryDate);
    }
    
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();
    
    await savedNotification.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: savedNotification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating notification'
    });
  }
};

// @desc    Update notification
// @route   PUT /api/notifications/update/:id
// @access  Private/Admin
exports.updateNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetAudience,
      isActive,
      expiryDate
    } = req.body;
    
    let notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (message) updateData.message = message;
    if (type) updateData.type = type;
    if (priority) updateData.priority = priority;
    if (targetAudience) updateData.targetAudience = Array.isArray(targetAudience) ? targetAudience : [targetAudience];
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (expiryDate) updateData.expiryDate = new Date(expiryDate);
    
    notification = await Notification.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email').select('-__v');
    
    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: notification
    });
  } catch (error) {
    console.error('Update notification error:', error);
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
        message: 'Invalid notification ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification'
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/delete/:id
// @access  Private/Admin
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Check if user already read this notification
    const alreadyRead = notification.readBy.some(
      read => read.user && read.user.toString() === req.user.userId
    );
    
    if (!alreadyRead) {
      notification.readBy.push({
        user: req.user.userId,
        readAt: new Date()
      });
      
      await notification.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while marking notification as read'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    const activeNotifications = await Notification.find({
      isActive: true,
      expiryDate: { $gte: new Date() },
      $or: [
        { targetAudience: 'all' },
        { targetAudience: req.user.role },
        { targetAudience: { $in: [req.user.role] } }
      ]
    });
    
    const updatePromises = activeNotifications.map(notification => {
      const alreadyRead = notification.readBy.some(
        read => read.user && read.user.toString() === req.user.userId
      );
      
      if (!alreadyRead) {
        notification.readBy.push({
          user: req.user.userId,
          readAt: new Date()
        });
        return notification.save();
      }
      return Promise.resolve();
    });
    
    await Promise.all(updatePromises);
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {}
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking all notifications as read'
    });
  }
};

// @desc    Toggle notification status
// @route   PATCH /api/notifications/toggle-status/:id
// @access  Private/Admin
exports.toggleNotificationStatus = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    notification.isActive = !notification.isActive;
    await notification.save();
    
    await notification.populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: `Notification ${notification.isActive ? 'activated' : 'deactivated'} successfully`,
      data: notification
    });
  } catch (error) {
    console.error('Toggle notification status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while toggling notification status'
    });
  }
};

// @desc    Get notification statistics
// @route   GET /api/notifications/stats/overview
// @access  Private/Admin
exports.getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const activeNotifications = await Notification.countDocuments({
      isActive: true,
      expiryDate: { $gte: new Date() }
    });
    const expiredNotifications = await Notification.countDocuments({
      expiryDate: { $lt: new Date() }
    });
    
    const notificationsByType = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const recentNotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type createdAt isActive')
      .populate('createdBy', 'name');
    
    res.status(200).json({
      success: true,
      data: {
        total: totalNotifications,
        active: activeNotifications,
        expired: expiredNotifications,
        byType: notificationsByType,
        recent: recentNotifications
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notification statistics'
    });
  }
};