// thumbnail.routes.js
const express = require('express');
const thumbnailRouter = express.Router();
const { downloadThumbnail } = require('../controllers/thumbnail.controller');
const { downloadRateLimit } = require('../middleware/rateLimit.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');
const { validate, urlValidation } = require('../middleware/validate.middleware');
thumbnailRouter.post('/download', downloadRateLimit, optionalAuth, urlValidation, validate, downloadThumbnail);
module.exports = thumbnailRouter;
