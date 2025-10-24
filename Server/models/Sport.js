const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Sport type is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['outdoor', 'indoor', 'mixed', 'tournament', 'championship', 'league', 'competition', 'sports-meet'],
    default: 'outdoor'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  participatingTeam: {
    type: String,
    required: [true, 'Participating team is required'],
    trim: true
  },
  chiefGuest: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  details: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  colorCode: {
    type: String,
    default: '#059669'
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
sportSchema.index({ date: 1, status: 1 });
sportSchema.index({ category: 1 });

module.exports = mongoose.model('Sport', sportSchema);