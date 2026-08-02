const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Trip = require('../models/Trip');

// Auth Protection Middleware
const protect = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tripvault_secret_key_2026_super_secure_jwt_auth');
      req.userId = decoded.id;
      return next();
    }
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token authorization failed' });
  }
};

// All trip routes require authentication
router.use(protect);

// 1. POST /api/trips - Create new trip
router.post('/', async (req, res) => {
  try {
    const { title, destination, startDate, endDate, description, rating } = req.body;

    if (!title || !destination) {
      return res.status(400).json({ success: false, message: 'Title and destination are required' });
    }

    const newTrip = await Trip.create({
      title,
      destination,
      startDate: startDate || null,
      endDate: endDate || null,
      description: description || '',
      rating: rating ? Number(rating) : undefined,
      user: req.userId
    });

    return res.status(201).json({ success: true, data: newTrip });
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating trip', error: error.message });
  }
});

// 2. GET /api/trips - Get logged-in user's trips only
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    console.error('Get trips error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching trips', error: error.message });
  }
});

// 3. GET /api/trips/:id - Get single trip (owner only)
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this trip' });
    }

    return res.status(200).json({ success: true, data: trip });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching trip', error: error.message });
  }
});

// 4. PUT /api/trips/:id - Update trip (owner check)
router.put('/:id', async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Ownership check
    if (trip.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot edit another user\'s trip' });
    }

    const { title, destination, startDate, endDate, description, rating } = req.body;

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        title: title || trip.title,
        destination: destination || trip.destination,
        startDate: startDate || trip.startDate,
        endDate: endDate || trip.endDate,
        description: description !== undefined ? description : trip.description,
        rating: rating !== undefined ? Number(rating) : trip.rating
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, data: trip });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating trip', error: error.message });
  }
});

// 5. DELETE /api/trips/:id - Delete trip (owner check)
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Ownership check
    if (trip.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot delete another user\'s trip' });
    }

    await Trip.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting trip', error: error.message });
  }
});

module.exports = router;