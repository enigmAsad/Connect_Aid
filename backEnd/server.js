const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get the current host from environment or use default
const CURRENT_HOST = process.env.CURRENT_HOST || 'localhost';
const FRONTEND_PORT = process.env.FRONTEND_PORT || '5173';

// Define allowed origins dynamically
const allowedOrigins = [
  `http://${CURRENT_HOST}:${FRONTEND_PORT}`,  // Local frontend
  `http://${CURRENT_HOST}:5000`,              // Local backend
  'http://frontend:5173',                     // Docker frontend
  'http://backend:5000',                      // Docker backend
  // Add any additional origins from environment variable
  ...(process.env.ADDITIONAL_ORIGINS ? process.env.ADDITIONAL_ORIGINS.split(',') : [])
];

// Enable CORS with dynamic origin
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('CORS blocked request from:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!!!'))
  .catch(err => console.error('❌ Error while connecting to MongoDB:', err));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/appeals', require('./routes/appeals'));
app.use('/api/donations', require('./routes/donations'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user', require('./routes/profileInfo'));
app.use('/api/user', require('./routes/userInfo'));

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: '✅ Server is running',
    host: CURRENT_HOST,
    allowedOrigins: allowedOrigins
  });
});

// Health check endpoint for Docker
app.get('/api/health', (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB connection not ready');
      return res.status(503).json({
        status: 'error',
        message: 'Database connection not ready',
        details: {
          mongodb: mongoose.connection.readyState
        }
      });
    }

    res.status(200).json({
      status: 'ok',
      message: 'Server is healthy',
      details: {
        mongodb: 'connected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Start server - bind to 0.0.0.0 instead of 127.0.0.1 to allow connections from outside the container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://${CURRENT_HOST}:${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
});
