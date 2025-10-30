// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db.js'); 

const app = express();
const PORT = process.env.PORT || 3000;
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

// Middleware - INCREASE PAYLOAD SIZE LIMIT FOR IMAGES
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files - IMPROVED CONFIGURATION
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    // Set proper headers for images
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
    
    // Cache control for images
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
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
    'message': 'Server is running! port 3000',
    'imageUpload': 'Image upload system is active',
    'staticFiles': 'Static file serving is enabled for /uploads'
  });
});

// Health check route
app.get('/health', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads/events');
  const hasUploadsDir = fs.existsSync(uploadsDir);
  
  res.json({
    status: 'OK',
    server: 'Running',
    uploadsDirectory: hasUploadsDir ? 'Exists' : 'Missing',
    uploadsPath: uploadsDir
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, 'uploads')}`);
  console.log(`🖼️ Event images available at: http://localhost:${PORT}/uploads/events/`);
});