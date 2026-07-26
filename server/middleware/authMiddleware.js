const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'tripvault_secret_key_2026_super_secure_jwt_auth'
      );

      const isDbConnected = mongoose.connection.readyState === 1;

      if (isDbConnected && !decoded.id.startsWith('mem_')) {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      }

      req.user = {
        id: decoded.id,
        _id: decoded.id,
        name: decoded.name || 'TripVault Explorer',
        email: decoded.email || 'user@tripvault.com',
        createdAt: new Date().toISOString(),
      };

      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

module.exports = { protect };