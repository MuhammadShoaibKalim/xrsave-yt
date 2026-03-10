// ── shorts.controller.js ──────────────────────────────────────────────────
const ytdl = require('@distube/ytdl-core');
const { getInfoForDownload } = require('../services/ytdl.service');
const axios = require('axios');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const { isShortsUrl, isValidYouTubeUrl, normalizeUrl } = require('../utils/urlValidator');
const { sanitizeFilename } = require('../utils/formatHelper');
const Download = require('../models/Download.model');
const logger = require('../utils/logger');

const downloadShorts = asyncHandler(async (req, res) => {
  const { url, quality = 'highest' } = req.body;

  if (!isValidYouTubeUrl(url)) {
    throw new AppError('Invalid YouTube URL', 400, 'INVALID_URL');
  }

  const info = await getInfoForDownload(url);
  const details = info._isYtdlp ? info : info.videoDetails;
  const filename = sanitizeFilename(info._isYtdlp ? info.title : (details.title || `shorts_${details.videoId}`));

  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}.mp4"`);
  res.setHeader('Content-Type', 'video/mp4');

  let stream;
  if (info._isYtdlp) {
    logger.info('Using yt-dlp shorts stream fallback', { videoId: info.id });
    const format = info.formats.find(f => f.vcodec !== 'none' && f.acodec !== 'none') ||
      info.formats.find(f => f.vcodec !== 'none');

    if (!format || !format.url) throw new AppError('Could not find shorts format via fallback', 500);

    const axios = require('axios');
    const response = await axios({
      method: 'get',
      url: format.url,
      responseType: 'stream',
      headers: { 'User-Agent': 'googlebot', 'Referer': 'youtube.com' }
    });
    stream = response.data;
  } else {
    stream = ytdl.downloadFromInfo(info, {
      quality: 'highestvideo',
      filter: 'videoandaudio',
    });
  }

  stream.on('error', (err) => {
    logger.error('Shorts stream error', { error: err.message });
    if (!res.headersSent) res.status(500).json({ success: false, message: 'Download failed' });
  });

  // Log
  Download.create({
    userId: req.user?._id,
    videoId: info._isYtdlp ? info.id : details.videoId,
    title: info._isYtdlp ? info.title : details.title,
    url,
    channelName: info._isYtdlp ? info.uploader : details.author?.name,
    duration: parseInt(info._isYtdlp ? info.duration : details.lengthSeconds),
    type: 'shorts',
    format: 'mp4',
    status: 'completed',
    ipAddress: req.ip,
  }).catch(() => { });

  stream.pipe(res);
});

module.exports.downloadShorts = downloadShorts;
