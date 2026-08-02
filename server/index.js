require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection Setup
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Fall back to in-memory MongoDB server if MONGO_URI is not set
    if (!mongoUri) {
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('⚡ Using in-memory MongoDB Server for development');
    }

    // Connect to Mongoose without deprecated options
    await mongoose.connect(mongoUri);
    console.log('🚀 MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Route Mounts
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));