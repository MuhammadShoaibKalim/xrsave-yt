const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const logger = require('../utils/logger');

/**
 * Protect routes - verify JWT access token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in.',
        error: 'NO_TOKEN',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.id).select('-passwordHash -refreshToken');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
        error: 'USER_NOT_FOUND',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.',
        error: 'ACCOUNT_INACTIVE',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please refresh your session.',
        error: 'TOKEN_EXPIRED',
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        error: 'INVALID_TOKEN',
      });
    }

    logger.error('Auth middleware error', { error: err.message });
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

/**
 * Optional auth - attach user if token present, but don't block
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash -refreshToken');
    }
    next();
  } catch {
    next(); // Ignore errors for optional auth
  }
};

module.exports = { protect, optionalAuth };
