const { getRedisClient, isRedisConnected } = require('../config/redis');
const logger = require('../utils/logger');

const DEFAULT_TTL = 30 * 60; // 30 minutes

/**
 * Get value from cache
 */
const getCache = async (key) => {
  if (!isRedisConnected()) return null;
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    logger.warn('Cache get error', { key, error: err.message });
    return null;
  }
};

/**
 * Set value in cache
 */
const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  if (!isRedisConnected()) return false;
  try {
    const client = getRedisClient();
    await client.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (err) {
    logger.warn('Cache set error', { key, error: err.message });
    return false;
  }
};

/**
 * Delete value from cache
 */
const deleteCache = async (key) => {
  if (!isRedisConnected()) return false;
  try {
    const client = getRedisClient();
    await client.del(key);
    return true;
  } catch (err) {
    logger.warn('Cache delete error', { key, error: err.message });
    return false;
  }
};

/**
 * Cache video metadata
 */
const cacheVideoInfo = async (videoId, info) => {
  return setCache(`video:info:${videoId}`, info, 30 * 60);
};

/**
 * Get cached video info
 */
const getCachedVideoInfo = async (videoId) => {
  return getCache(`video:info:${videoId}`);
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  cacheVideoInfo,
  getCachedVideoInfo,
};
