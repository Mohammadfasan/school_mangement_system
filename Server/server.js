const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db.js'); 

const app = express();
const PORT = process.env.PORT || 5000; // CHANGED FROM 3000 TO 5000
connectDB();

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const eventsDir = path.join(__dirname, 'uploads/events');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
  }
  
  if (!fs.existsSync(eventsDir)) {
    fs.mkdirSync(eventsDir, { recursive: true });
    console.log('📁 Created uploads/events directory');
  }
};

ensureUploadsDir();

// Middleware - FIXED CORS CONFIGURATION
app.use(cors({
  origin: [
    'http://localhost:5173',
    
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/timetable', require('./routes/timtableRoutes.js'));
app.use('/api/students', require('./routes/studentRoutes.js'));
app.use('/api/sports', require('./routes/sportRoutes.js'));
app.use('/api/events', require('./routes/eventRoutes.js'));
app.use('/api/achievements', require('./routes/achievementRoutes.js'));
app.use('/api/announcements', require('./routes/announcementRoutes.js'));
app.use('/api/notifications', require('./routes/notificationRoutes.js'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    'message': 'Server is running! port 5000', // UPDATED PORT
    'imageUpload': 'Image upload system is active',
    'staticFiles': 'Static file serving is enabled for /uploads',
    'cors': 'CORS enabled for frontend connections'
  });
});

// Health check route
app.get('/health', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads/events');
  const hasUploadsDir = fs.existsSync(uploadsDir);
  
  res.json({
    status: 'OK',
    server: 'Running on port 5000', // UPDATED PORT
    uploadsDirectory: hasUploadsDir ? 'Exists' : 'Missing',
    uploadsPath: uploadsDir,
    cors: 'Enabled for frontend'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`); // UPDATED PORT
  console.log(`📁 Static files served from: ${path.join(__dirname, 'uploads')}`);
  console.log(`🖼️ Event images available at: http://localhost:${PORT}/uploads/events/`);
  console.log(`🌐 CORS enabled for: http://localhost:5173 and your deployed domain`);
});