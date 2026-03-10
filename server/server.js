require('dotenv').config();
const dns = require('dns');

// Force DNS resolution to use Google DNS to fix ECONNREFUSED on Windows with MongoDB SRV
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require('./app');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err.message, stack: err.stack });
  process.exit(1);
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis (non-blocking)
    connectRedis().catch((err) => {
      logger.warn('Redis connection failed, continuing without cache', { error: err.message });
    });

    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`✅ XRSave-YT server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down...', { error: err.message });
      server.close(() => process.exit(1));
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Gracefully shutting down...');
      server.close(() => {
        logger.info('Process terminated.');
        process.exit(0);
      });
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};

startServer();
