// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  student: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  award: {
    type: String,
    required: [true, 'Award is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Sport', 'Academic', 'Art', 'Other'],
      message: 'Category must be Sport, Academic, Art, or Other'
    },
    default: 'Sport'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    trim: true
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['upcoming', 'completed', 'canceled'],
      message: 'Status must be upcoming, completed, or canceled'
    },
    default: 'upcoming'
  },
  // --- MODIFIED ---
  image: {
    type: String,
    default: '/uploads/events/default-event.jpg' // Set a default image path
  },
  // --- ADDED ---
  imageKitFileId: {
    type: String, // Store ImageKit file ID for deletion
    default: null
  },
  organizer: {
    type: String,
    default: 'School Administration',
    trim: true
  },
  audience: {
    type: String,
    default: 'All Students',
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  // --- REMOVED `days_left` field ---
  // It is correctly handled by the virtual property below
}, {
  timestamps: true
});

// Virtual for days left (for upcoming events)
eventSchema.virtual('daysLeft').get(function() {
  if (this.status === 'upcoming' && this.date) {
    const today = new Date();
    const eventDate = new Date(this.date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
  return null;
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Index for better query performance
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);