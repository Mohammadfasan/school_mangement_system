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

module.exports = {
  getAllGrades,
  getGradeTimetable,
  updateTimetableSlot,
  createGrade,
  getAllSubjects,
  createSubject,
  clearTimetableSlot
};