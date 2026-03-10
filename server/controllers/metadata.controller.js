const { getVideoInfo } = require('../services/ytdl.service');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const { isValidYouTubeUrl, extractVideoId } = require('../utils/urlValidator');
const { getThumbnailUrl, THUMBNAIL_QUALITIES } = require('../utils/formatHelper');

// POST /api/metadata/info
const getInfo = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!isValidYouTubeUrl(url)) {
    throw new AppError('Invalid YouTube URL', 400, 'INVALID_URL');
  }

  const info = await getVideoInfo(url);

  res.json({
    success: true,
    data: info,
  });
});

// POST /api/metadata/thumbnail
const getThumbnails = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!isValidYouTubeUrl(url)) {
    throw new AppError('Invalid YouTube URL', 400, 'INVALID_URL');
  }

  const videoId = extractVideoId(url);
  if (!videoId) throw new AppError('Could not extract video ID', 400);

  const thumbnails = THUMBNAIL_QUALITIES.map((q) => ({
    quality: q.label,
    value: q.value,
    url: getThumbnailUrl(videoId, q.suffix),
  }));

  res.json({
    success: true,
    data: { videoId, thumbnails },
  });
});

module.exports = { getInfo, getThumbnails };
