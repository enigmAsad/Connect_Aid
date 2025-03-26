const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for localhost (Vite)
app.use(cors({
  origin: 'http://localhost:5173', // ✅ No trailing slash
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
  res.json({ message: '✅ Server is running on localhost' });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
