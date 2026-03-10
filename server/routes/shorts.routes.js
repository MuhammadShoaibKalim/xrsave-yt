const express = require('express');
const router = express.Router();
const { downloadShorts } = require('../controllers/shorts.controller');
const { downloadRateLimit } = require('../middleware/rateLimit.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');
const { validate, urlValidation } = require('../middleware/validate.middleware');

router.post('/download', downloadRateLimit, optionalAuth, urlValidation, validate, downloadShorts);
module.exports = router;
