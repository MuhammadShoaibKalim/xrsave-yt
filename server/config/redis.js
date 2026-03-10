const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;
let isConnected = false;

const connectRedis = async () => {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  redisClient = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null; // Stop retrying
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
    tls: url.startsWith('rediss://') ? {} : undefined,
  });

  redisClient.on('connect', () => {
    isConnected = true;
    logger.info('✅ Redis connected');
  });

  redisClient.on('error', (err) => {
    isConnected = false;
    logger.warn('Redis error (non-fatal)', { error: err.message });
  });

  redisClient.on('close', () => {
    isConnected = false;
  });

  await redisClient.connect();
  return redisClient;
};

const getRedisClient = () => redisClient;

const isRedisConnected = () => isConnected;

module.exports = { connectRedis, getRedisClient, isRedisConnected };
