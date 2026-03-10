// auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getMe } = require('../controllers/auth.controller');
const { authRateLimit } = require('../middleware/rateLimit.middleware');
const { protect } = require('../middleware/auth.middleware');
const { validate, authValidation } = require('../middleware/validate.middleware');

router.post('/register', authRateLimit, authValidation.register, validate, register);
router.post('/login', authRateLimit, authValidation.login, validate, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
