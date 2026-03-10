// video.routes.js
const express = require('express');
const videoRouter = express.Router();
const { downloadVideo, getFormats } = require('../controllers/video.controller');
const { downloadRateLimit } = require('../middleware/rateLimit.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');
const { validate, urlValidation } = require('../middleware/validate.middleware');

videoRouter.post('/download', downloadRateLimit, optionalAuth, urlValidation, validate, downloadVideo);
videoRouter.get('/formats', getFormats);
module.exports = videoRouter;
