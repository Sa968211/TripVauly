const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Read token from request header
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Extract token string if "Bearer <token>" is passed
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Verify token
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};