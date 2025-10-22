// models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String,
    default: '#f3f4f6'
  },

}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);