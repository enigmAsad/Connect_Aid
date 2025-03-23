// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
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

// Add a test route to verify the server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

//app.listen(PORT, '0'() => console.log(`Server running on http://localhost:${PORT}`));

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});