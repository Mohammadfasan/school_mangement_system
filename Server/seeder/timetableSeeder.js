// seeders/timetableSeeder.js
const mongoose = require('mongoose');
const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
require('dotenv').config();

const connectDB = require('../config/db.js');

const initialSubjects = [
  {
    name: 'Mathematics',
    code: 'MATH',
    color: 'bg-blue-100',
    teacher: 'Mr. Smith'
  },
  {
    name: 'Science',
    code: 'SCI',
    color: 'bg-green-100',
    teacher: 'Ms. Johnson'
  },
  {
    name: 'English',
    code: 'ENG',
    color: 'bg-red-100',
    teacher: 'Mrs. Davis'
  },
  {
    name: 'History',
    code: 'HIST',
    color: 'bg-yellow-100',
    teacher: 'Mr. Wilson'
  },
  {
    name: 'Physical Education',
    code: 'PE',
    color: 'bg-purple-100',
    teacher: 'Coach Taylor'
  }
];

const initialGrades = [
  {
    grade: '11',
    hallNo: 'H101',
    room: 'Room 101',
    timetable: [
      { period: '1', monday: { subject: 'Mathematics' }, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '2', monday: {}, tuesday: { subject: 'Science' }, wednesday: {}, thursday: {}, friday: {} },
      { period: '3', monday: {}, tuesday: {}, wednesday: { subject: 'English' }, thursday: {}, friday: {} },
      { period: '4', monday: {}, tuesday: {}, wednesday: {}, thursday: { subject: 'History' }, friday: {} }
    ],
    interval: [
      { period: '5', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: { subject: 'Physical Education' } },
      { period: '6', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '7', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Grade.deleteMany({});
    await Subject.deleteMany({});
    
    // Insert subjects
    await Subject.insertMany(initialSubjects);
    console.log('Subjects seeded successfully');
    
    // Insert grades
    await Grade.insertMany(initialGrades);
    console.log('Grades seeded successfully');
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();