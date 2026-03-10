const express = require('express');
const router = express.Router();
const { getInfo, getThumbnails } = require('../controllers/metadata.controller');
const { metadataRateLimit } = require('../middleware/rateLimit.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');
const { validate, urlValidation } = require('../middleware/validate.middleware');

router.post('/info', metadataRateLimit, optionalAuth, urlValidation, validate, getInfo);
router.post('/thumbnail', metadataRateLimit, optionalAuth, urlValidation, validate, getThumbnails);

module.exports = router;
