const express = require('express');
const router = express.Router();
const { getPlaylistInfo, downloadPlaylist, getJobStatus } = require('../controllers/playlist.controller');
const { downloadRateLimit } = require('../middleware/rateLimit.middleware');

router.post('/info', downloadRateLimit, getPlaylistInfo);
router.post('/download', downloadRateLimit, downloadPlaylist);
router.get('/status/:jobId', getJobStatus);
module.exports = router;
