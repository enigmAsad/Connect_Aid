const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend (S3 URL & Localhost)
app.use(cors({
  origin: ['http://frontend-connectaid.s3-website.eu-north-1.amazonaws.com', 'http://localhost:5173'], // ✅ No trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/', require('./routes/auth'));
app.use('/api/appeals', require('./routes/appeals'));
app.use('/api/user', require('./routes/userInfo'));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Ensure Elastic Beanstalk binds correctly
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
