const mongoose = require('mongoose');

// Define the schema for a Student
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no two students have the same email
    lowercase: true, // Converts email to lowercase
    trim: true
  },
  age: {
    type: Number,
    required: false // You can make fields optional
  },
  enrolledDate: {
    type: Date,
    default: Date.now // Sets a default value to the current date/time
  }
});

// Create the model from the schema
// Mongoose will automatically look for the plural, lowercase version 
// of this name. So, 'Student' will become the 'students' collection.
const Student = mongoose.model('Student', studentSchema);

// Export the model
module.exports = Student;