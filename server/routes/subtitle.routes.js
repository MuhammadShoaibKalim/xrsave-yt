const express = require('express');
const router = express.Router();
const { getLanguages, downloadSubtitle } = require('../controllers/subtitle.controller');
const { downloadRateLimit } = require('../middleware/rateLimit.middleware');
const { validate, urlValidation } = require('../middleware/validate.middleware');

router.get('/languages', getLanguages);
router.post('/download', downloadRateLimit, urlValidation, validate, downloadSubtitle);
module.exports = router;
