// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db.js'); 

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/timetable', require('./routes/timtableRoutes.js'));
app.use('/api/students', require('./routes/studentRoutes.js'));
app.use('/api/sports', require('./routes/sportRoutes.js'));
app.use('/api/events', require('./routes/eventRoutes.js'));
app.use('/api/achievements', require('./routes/achievementRoutes.js'));
app.use('/api/announcements', require('./routes/announcementRoutes.js'));


// Basic route
app.get('/', (req, res) => {
  res.json({ 'message': 'Server is running! port 3000' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});