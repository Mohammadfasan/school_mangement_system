// models/Grade.js
const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true
  },
  monday: {
    subject: String,
    color: String
  },
  tuesday: {
    subject: String,
    color: String
  },
  wednesday: {
    subject: String,
    color: String
  },
  thursday: {
    subject: String,
    color: String
  },
  friday: {
    subject: String,
    color: String
  }
});

const gradeSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: true,
    unique: true
  },
  hallNo: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  timetable: [periodSchema],
  interval: [periodSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema);