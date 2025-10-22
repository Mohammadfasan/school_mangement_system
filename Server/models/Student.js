const mongoose = require('mongoose');

// Define the schema for a Student
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true 
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true, 
    trim: true
  },
  age: {
    type: Number,
    required: false
  },
  enrolledDate: {
    type: Date,
    default: Date.now 
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;