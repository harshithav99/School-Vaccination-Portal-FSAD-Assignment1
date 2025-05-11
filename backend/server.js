require('dotenv').config();
console.log('JWT_SECRET is', process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const app = express();

// Correct CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',   // Allow your frontend origin
  credentials: true                  // Allow cookies, authorization headers, etc.
}));

const connectDB = require('./db');
connectDB();

// Basic middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

const driveRoutes = require('./routes/driveRoutes');
app.use('/api/drives', driveRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5055;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});