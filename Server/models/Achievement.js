// models/Achievement.js
const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true
  },
  student: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
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
    enum: ['Sport', 'Academic', 'Cultural', 'Leadership', 'Art', 'Other'],
    default: 'Sport'
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300.png?text=Achievement'
  },
  highlight: {
    type: Boolean,
    default: false
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
achievementSchema.index({ category: 1, date: -1 });
achievementSchema.index({ highlight: 1, date: -1 });

module.exports = mongoose.model('Achievement', achievementSchema);