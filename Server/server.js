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

// Basic route
app.get('/', (req, res) => {
  res.json({ 'message': 'Server is running! port 3000' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});