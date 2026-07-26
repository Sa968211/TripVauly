const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tripvault';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection with Auto Fallback
const connectDB = async () => {
  try {
    // Attempt standard MongoDB connection with 3000ms timeout
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI.includes('@') ? 'MongoDB Atlas' : MONGO_URI}`);
  } catch (err) {
    console.warn(`[MongoDB] Local/Primary Mongo not reachable (${err.message}). Starting In-Memory MongoDB Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`🚀 [MongoDB] Successfully connected to auto-provisioned In-Memory MongoDB at: ${uri}`);
    } catch (fallbackErr) {
      console.error('[MongoDB] Critical connection error:', fallbackErr.message);
    }
  }
};

connectDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));

// Root Health Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'TripVault API Server',
    version: '1.0.0',
    status: 'Running',
    week: 1,
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me (Protected)',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 [TripVault Backend Server] running on http://localhost:${PORT}`);
});
