const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      error: 'RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        limit: max,
      });
      res.status(429).json(options.message);
    },
  });
};

// Global rate limit: 100 req per 15 min
const globalRateLimit = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  parseInt(process.env.RATE_LIMIT_MAX) || 100,
  'Too many requests from this IP. Please try again in 15 minutes.'
);

// Download endpoints: 10 req per minute
const downloadRateLimit = createLimiter(
  60 * 1000,
  10,
  'Too many download requests. Please wait before downloading again.'
);

// Auth endpoints: 5 req per minute
const authRateLimit = createLimiter(
  60 * 1000,
  5,
  'Too many authentication attempts. Please try again later.'
);

// Metadata: 30 req per minute
const metadataRateLimit = createLimiter(
  60 * 1000,
  30,
  'Too many metadata requests. Please slow down.'
);

module.exports = {
  globalRateLimit,
  downloadRateLimit,
  authRateLimit,
  metadataRateLimit,
};
