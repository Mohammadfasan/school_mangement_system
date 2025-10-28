// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  targetAudience: {
    type: [String],
    enum: ['students', 'teachers', 'parents', 'all'],
    default: ['all']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiryDate: {
    type: Date,
    default: function() {
      // Default expiry in 30 days
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ isActive: 1, expiryDate: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdBy: 1 });

// Virtual for checking if notification is expired
notificationSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

module.exports = mongoose.model('Notification', notificationSchema);