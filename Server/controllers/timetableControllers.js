// controllers/timetableController.js
const Grade = require('../models/Grade');
const Subject = require('../models/Subject');

// Get all grades with timetables
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find().sort({ grade: 1 });
    res.json({
      success: true,
      data: { grades }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grades',
      error: error.message
    });
  }
};

// Get single grade timetable
const getGradeTimetable = async (req, res) => {
  try {
    const { grade } = req.params;
    const gradeData = await Grade.findOne({ grade });
    
    if (!gradeData) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    res.json({
      success: true,
      data: gradeData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable',
      error: error.message
    });
  }
};

// Update timetable slot
const updateTimetableSlot = async (req, res) => {
  try {
    const { grade, period, day, subject, color } = req.body;

    // Validate input
    if (!grade || !period || !day || !subject) {
      return res.status(400).json({
        success: false,
        message: 'grade, period, day, and subject are required'
      });
    }

    const gradeData = await Grade.findOne({ grade });
    if (!gradeData) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    const periodNum = parseInt(period);
    const targetArray = periodNum <= 4 ? 'timetable' : 'interval';

    // Find the period in the appropriate array
    const periodIndex = gradeData[targetArray].findIndex(
      p => p.period.toString() === period
    );

    if (periodIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Period not found'
      });
    }

    // Update the specific day's subject
    gradeData[targetArray][periodIndex][day] = {
      subject,
      color: color || 'bg-yellow-100'
    };

    await gradeData.save();

    res.json({
      success: true,
      message: 'Timetable updated successfully',
      data: gradeData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating timetable',
      error: error.message
    });
  }
};

// Create new grade with empty timetable
const createGrade = async (req, res) => {
  try {
    const { grade, hallNo, room } = req.body;

    // Check if grade already exists
    const existingGrade = await Grade.findOne({ grade });
    if (existingGrade) {
      return res.status(400).json({
        success: false,
        message: 'Grade already exists'
      });
    }

    // Create empty timetable structure
    const emptyTimetable = [
      { period: '1', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '2', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '3', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '4', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} }
    ];

    const emptyInterval = [
      { period: '5', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '6', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '7', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} }
    ];

    const newGrade = new Grade({
      grade,
      hallNo,
      room,
      timetable: emptyTimetable,
      interval: emptyInterval
    });

    await newGrade.save();

    res.status(201).json({
      success: true,
      message: 'Grade created successfully',
      data: newGrade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating grade',
      error: error.message
    });
  }
};

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// Create new subject
const createSubject = async (req, res) => {
  try {
    const { name, code, color } = req.body;

    const existingSubject = await Subject.findOne({ 
      $or: [{ name }, { code }] 
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject with this name or code already exists'
      });
    }

    const newSubject = new Subject({
      name,
      code,
      color
    });

    await newSubject.save();

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: newSubject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subject',
      error: error.message
    });
  }
};

// Delete timetable slot (clear subject)
const clearTimetableSlot = async (req, res) => {
  try {
    const { grade, period, day } = req.body;

    const gradeData = await Grade.findOne({ grade });
    if (!gradeData) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    const periodNum = parseInt(period);
    const targetArray = periodNum <= 4 ? 'timetable' : 'interval';

    const periodIndex = gradeData[targetArray].findIndex(
      p => p.period.toString() === period
    );

    if (periodIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Period not found'
      });
    }

    // Clear the specific day's subject
    gradeData[targetArray][periodIndex][day] = {};
    await gradeData.save();

    res.json({
      success: true,
      message: 'Timetable slot cleared successfully',
      data: gradeData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing timetable slot',
      error: error.message
    });
  }
};

// Create default grades
const createDefaultGrades = async (req, res) => {
  try {
    const defaultGrades = [
      {
        grade: '1',
        hallNo: 'A101',
        room: 'Room 1',
        timetable: [
          { period: '1', monday: { subject: 'Math', color: 'bg-blue-100' }, tuesday: { subject: 'English', color: 'bg-green-100' }, wednesday: { subject: 'Science', color: 'bg-yellow-100' }, thursday: { subject: 'Math', color: 'bg-blue-100' }, friday: { subject: 'Art', color: 'bg-purple-100' } },
          { period: '2', monday: { subject: 'English', color: 'bg-green-100' }, tuesday: { subject: 'Science', color: 'bg-yellow-100' }, wednesday: { subject: 'Math', color: 'bg-blue-100' }, thursday: { subject: 'PE', color: 'bg-red-100' }, friday: { subject: 'Music', color: 'bg-pink-100' } },
          { period: '3', monday: { subject: 'Science', color: 'bg-yellow-100' }, tuesday: { subject: 'Math', color: 'bg-blue-100' }, wednesday: { subject: 'English', color: 'bg-green-100' }, thursday: { subject: 'Science', color: 'bg-yellow-100' }, friday: { subject: 'Math', color: 'bg-blue-100' } },
          { period: '4', monday: { subject: 'PE', color: 'bg-red-100' }, tuesday: { subject: 'Art', color: 'bg-purple-100' }, wednesday: { subject: 'Music', color: 'bg-pink-100' }, thursday: { subject: 'English', color: 'bg-green-100' }, friday: { subject: 'Science', color: 'bg-yellow-100' } }
        ],
        interval: [
          { period: '5', monday: { subject: 'Break', color: 'bg-gray-100' }, tuesday: { subject: 'Break', color: 'bg-gray-100' }, wednesday: { subject: 'Break', color: 'bg-gray-100' }, thursday: { subject: 'Break', color: 'bg-gray-100' }, friday: { subject: 'Break', color: 'bg-gray-100' } },
          { period: '6', monday: { subject: 'Social Studies', color: 'bg-indigo-100' }, tuesday: { subject: 'Computer', color: 'bg-teal-100' }, wednesday: { subject: 'Social Studies', color: 'bg-indigo-100' }, thursday: { subject: 'Computer', color: 'bg-teal-100' }, friday: { subject: 'Library', color: 'bg-orange-100' } },
          { period: '7', monday: { subject: 'Computer', color: 'bg-teal-100' }, tuesday: { subject: 'Social Studies', color: 'bg-indigo-100' }, wednesday: { subject: 'Computer', color: 'bg-teal-100' }, thursday: { subject: 'Social Studies', color: 'bg-indigo-100' }, friday: { subject: 'Games', color: 'bg-red-100' } }
        ]
      }
    ];

    // Clear existing grades and create default ones
    await Grade.deleteMany({});
    const createdGrades = await Grade.insertMany(defaultGrades);

    res.json({
      success: true,
      message: 'Default grades created successfully',
      data: createdGrades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating default grades',
      error: error.message
    });
  }
};

// Get timetable statistics
const getTimetableStats = async (req, res) => {
  try {
    const totalGrades = await Grade.countDocuments();
    const grades = await Grade.find();
    
    let totalPeriods = 0;
    let weeklyClasses = 0;
    const subjectsSet = new Set();

    grades.forEach(grade => {
      // Count periods in timetable and interval
      totalPeriods += (grade.timetable.length + grade.interval.length);
      
      // Count weekly classes (non-empty subjects)
      grade.timetable.forEach(period => {
        days.forEach(day => {
          if (period[day]?.subject && period[day].subject.trim() !== '') {
            weeklyClasses++;
            subjectsSet.add(period[day].subject);
          }
        });
      });
      
      grade.interval.forEach(period => {
        days.forEach(day => {
          if (period[day]?.subject && period[day].subject.trim() !== '' && period[day].subject !== 'Break') {
            weeklyClasses++;
            subjectsSet.add(period[day].subject);
          }
        });
      });
    });

    res.json({
      success: true,
      data: {
        totalGrades,
        totalPeriods,
        weeklyClasses,
        totalSubjects: subjectsSet.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Delete grade
const deleteGrade = async (req, res) => {
  try {
    const { grade } = req.params;
    
    const deletedGrade = await Grade.findOneAndDelete({ grade });
    
    if (!deletedGrade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    res.json({
      success: true,
      message: 'Grade timetable deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting grade',
      error: error.message
    });
  }
};

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

module.exports = {
  getAllGrades,
  getGradeTimetable,
  updateTimetableSlot,
  createGrade,
  getAllSubjects,
  createSubject,
  clearTimetableSlot,
  createDefaultGrades,
  getTimetableStats,
  deleteGrade
};