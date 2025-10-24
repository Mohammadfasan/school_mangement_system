const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
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
    enum: ['Sport', 'Academic', 'Art', 'Other'],
    default: 'Sport'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'canceled'],
    default: 'upcoming'
  },
  audience: {
    type: String,
    default: 'All Students'
  },
  organizer: {
    type: String,
    default: 'School Administration'
  },
  days_left: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ student: 1 });

module.exports = mongoose.model('Event', eventSchema);