// models/Announcement.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Announcement description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
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
  expiryDate: {
    type: Date,
    default: function() {
      // Default expiry in 7 days
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
announcementSchema.index({ isActive: 1, expiryDate: 1 });
announcementSchema.index({ createdAt: -1 });

// Virtual for checking if announcement is expired
announcementSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

module.exports = mongoose.model('Announcement', announcementSchema);