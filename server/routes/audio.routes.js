const express = require('express');
const router = express.Router();
const { downloadAudio, getFormats } = require('../controllers/audio.controller');
const { downloadRateLimit } = require('../middleware/rateLimit.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');
const { validate, urlValidation } = require('../middleware/validate.middleware');

router.post('/download', downloadRateLimit, optionalAuth, urlValidation, validate, downloadAudio);
router.get('/formats', getFormats);
module.exports = router;
