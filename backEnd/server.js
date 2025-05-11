const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for both local development and Docker
app.use(cors({
  origin: ['http://localhost:5173', 'http://frontend:5173'], // Allow both local and Docker container access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// Routes
app.use('/', require('./routes/auth'));
app.use('/api/appeals', require('./routes/appeals'));
app.use('/api/donations', require('./routes/donations'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user', require('./routes/profileInfo'));
app.use('/api/user', require('./routes/userInfo'));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: '✅ Server is running' });
});

// Health check endpoint for Docker
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server - bind to 0.0.0.0 instead of 127.0.0.1 to allow connections from outside the container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
