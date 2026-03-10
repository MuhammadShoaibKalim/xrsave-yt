const ytdl = require('@distube/ytdl-core');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const { isValidPlaylistUrl, extractPlaylistId } = require('../utils/urlValidator');
const logger = require('../utils/logger');

// POST /api/playlist/info
const getPlaylistInfo = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!isValidPlaylistUrl(url)) {
    throw new AppError('Invalid YouTube playlist URL', 400, 'INVALID_PLAYLIST_URL');
  }

  const playlistId = extractPlaylistId(url);
  if (!playlistId) throw new AppError('Could not extract playlist ID', 400);

  // Note: ytdl-core has limited playlist support
  // For full playlist support, yt-dlp-wrap would be more reliable
  // This returns basic info
  res.json({
    success: true,
    data: {
      playlistId,
      message: 'Playlist info endpoint - integrate with yt-dlp for full playlist support',
      url,
    },
  });
});

// POST /api/playlist/download
const downloadPlaylist = asyncHandler(async (req, res) => {
  const { url, type = 'video', quality = '720p', format = 'mp3' } = req.body;

  if (!isValidPlaylistUrl(url)) {
    throw new AppError('Invalid YouTube playlist URL', 400, 'INVALID_PLAYLIST_URL');
  }

  // For production, implement Bull queue here
  // This is a stub response
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  res.json({
    success: true,
    message: 'Playlist download queued',
    data: {
      jobId,
      status: 'pending',
      statusUrl: `/api/playlist/status/${jobId}`,
    },
  });
});

// GET /api/playlist/status/:jobId
const getJobStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  // In production, check Bull queue status here
  res.json({
    success: true,
    data: {
      jobId,
      status: 'pending',
      progress: 0,
      message: 'Job queued',
    },
  });
});

module.exports = { getPlaylistInfo, downloadPlaylist, getJobStatus };
