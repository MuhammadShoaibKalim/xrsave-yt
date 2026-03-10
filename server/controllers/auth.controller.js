const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const logger = require('../utils/logger');

/**
 * Generate token pair
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
  return { accessToken, refreshToken };
};

/**
 * Set refresh token cookie
 */
const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token
  await User.findByIdAndUpdate(user._id, { refreshToken });

  setRefreshCookie(res, refreshToken);

  logger.info('New user registered', { userId: user._id, email });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: user.toJSON(),
      accessToken,
    },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403, 'ACCOUNT_INACTIVE');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  await User.findByIdAndUpdate(user._id, { refreshToken });

  setRefreshCookie(res, refreshToken);

  logger.info('User logged in', { userId: user._id });

  res.json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: user.toJSON(),
      accessToken,
    },
  });
});

// POST /api/auth/refresh-token
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError('No refresh token', 401, 'NO_REFRESH_TOKEN');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new AppError('Refresh token is invalid or reused', 401, 'TOKEN_REUSE');
  }

  // Rotate tokens
  const tokens = generateTokens(user._id);
  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  setRefreshCookie(res, tokens.refreshToken);

  res.json({
    success: true,
    data: { accessToken: tokens.accessToken },
  });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    // Invalidate refresh token
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  }

  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

module.exports = { register, login, refreshToken, logout, getMe };
