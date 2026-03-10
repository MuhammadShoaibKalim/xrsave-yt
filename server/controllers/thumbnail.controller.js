const https = require('https');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const { isValidYouTubeUrl, extractVideoId } = require('../utils/urlValidator');
const { getThumbnailUrl, THUMBNAIL_QUALITIES } = require('../utils/formatHelper');
const Download = require('../models/Download.model');
const logger = require('../utils/logger');

// POST /api/thumbnail/download
const downloadThumbnail = asyncHandler(async (req, res) => {
  const { url, quality = 'maxresdefault' } = req.body;

  if (!isValidYouTubeUrl(url)) {
    throw new AppError('Invalid YouTube URL', 400, 'INVALID_URL');
  }

  const videoId = extractVideoId(url);
  if (!videoId) throw new AppError('Could not extract video ID', 400);

  const validQualities = THUMBNAIL_QUALITIES.map((q) => q.suffix);
  const thumbnailQuality = validQualities.includes(quality) ? quality : 'maxresdefault';

  const thumbnailUrl = getThumbnailUrl(videoId, thumbnailQuality);
  const filename = `thumbnail_${videoId}_${thumbnailQuality}.jpg`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'image/jpeg');

  // Try requested quality, fallback to hqdefault
  const tryDownload = (thumbUrl, fallback) => {
    https.get(thumbUrl, (imgRes) => {
      if (imgRes.statusCode === 200) {
        imgRes.pipe(res);
      } else if (fallback) {
        const fallbackUrl = getThumbnailUrl(videoId, 'hqdefault');
        tryDownload(fallbackUrl, false);
      } else {
        res.status(404).json({ success: false, message: 'Thumbnail not found' });
      }
    }).on('error', (err) => {
      logger.error('Thumbnail download error', { error: err.message });
      res.status(500).json({ success: false, message: 'Thumbnail download failed' });
    });
  };

  tryDownload(thumbnailUrl, thumbnailQuality === 'maxresdefault');

  // Log download (don't await)
  Download.create({
    userId: req.user?._id,
    videoId,
    title: `Thumbnail - ${videoId}`,
    thumbnail: thumbnailUrl,
    url,
    type: 'thumbnail',
    quality: thumbnailQuality,
    format: 'jpg',
    status: 'completed',
    ipAddress: req.ip,
  }).catch((err) => logger.warn('Failed to log thumbnail download', { error: err.message }));
});

module.exports = { downloadThumbnail };
