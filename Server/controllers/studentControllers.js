// controllers/studentController.js
const Student = require('../models/Student');

// Get all students with filtering and pagination
exports.getAllStudents = async (req, res) => {
  try {
    const { grade, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (grade && grade !== 'all') {
      filter.grade = grade;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { name: 1 }
    };

    const students = await Student.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Student.countDocuments(filter);

    res.json({
      success: true,
      data: {
        students,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const { name, address, grade, gender, email, phone, dateOfBirth, parentName, parentPhone } = req.body;

    // Check if student with same name and grade already exists
    const existingStudent = await Student.findOne({ 
      name: name.trim(),
      grade 
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'Student with this name already exists in the same grade'
      });
    }

    const student = new Student({
      name: name.trim(),
      address: address.trim(),
      grade,
      gender,
      email: email?.trim(),
      phone: phone?.trim(),
      dateOfBirth,
      parentName: parentName?.trim(),
      parentPhone: parentPhone?.trim()
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { name, address, grade, gender, email, phone, dateOfBirth, parentName, parentPhone } = req.body;

    // Check if another student with same name and grade exists (excluding current student)
    const existingStudent = await Student.findOne({ 
      name: name.trim(),
      grade,
      _id: { $ne: req.params.id }
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'Another student with this name already exists in the same grade'
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        address: address.trim(),
        grade,
        gender,
        email: email?.trim(),
        phone: phone?.trim(),
        dateOfBirth,
        parentName: parentName?.trim(),
        parentPhone: parentPhone?.trim(),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// Delete student (soft delete)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// Get students by grade
exports.getStudentsByGrade = async (req, res) => {
  try {
    const { grade } = req.params;
    
    const students = await Student.find({ 
      grade,
      isActive: true 
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: {
        students,
        count: students.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students by grade',
      error: error.message
    });
  }
};

// Get student statistics
exports.getStudentStatistics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    
    const gradeStats = await Student.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const genderStats = await Student.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        gradeStats,
        genderStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student statistics',
      error: error.message
    });
  }
};