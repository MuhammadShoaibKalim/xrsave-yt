const ytdl = require('@distube/ytdl-core');
const { getVideoInfo, getInfoForDownload, createVideoStream } = require('../services/ytdl.service');
const axios = require('axios');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const { isValidYouTubeUrl, normalizeUrl } = require('../utils/urlValidator');
const { sanitizeFilename, VIDEO_QUALITIES } = require('../utils/formatHelper');
const Download = require('../models/Download.model');
const logger = require('../utils/logger');

// POST /api/video/download
const downloadVideo = asyncHandler(async (req, res) => {
  const { url, quality = 'highest', itag } = req.body;

  if (!isValidYouTubeUrl(url)) {
    throw new AppError('Invalid YouTube URL', 400, 'INVALID_URL');
  }

  const info = await getInfoForDownload(url);
  const details = info._isYtdlp ? info : info.videoDetails;

  const filename = sanitizeFilename(info._isYtdlp ? info.title : details.title);
  const safeFilename = encodeURIComponent(filename);

  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.mp4"; filename*=UTF-8''${safeFilename}.mp4`);
  res.setHeader('Content-Type', 'video/mp4');

  let videoStream;

  if (info._isYtdlp) {
    logger.info('Using yt-dlp stream fallback', { videoId: info.id });
    // Find a suitable format URL
    const format = itag
      ? info.formats.find(f => f.format_id === itag)
      : info.formats.find(f => f.vcodec !== 'none' && f.acodec !== 'none');

    if (!format || !format.url) {
      throw new AppError('Could not find a playable format via fallback', 500);
    }

    const response = await axios({
      method: 'get',
      url: format.url,
      responseType: 'stream',
      headers: { 'User-Agent': 'googlebot', 'Referer': 'youtube.com' }
    });
    videoStream = response.data;
  } else {
    // Select format
    let downloadOptions = {};
    if (itag) {
      downloadOptions = { quality: itag };
    } else if (quality === 'highest') {
      downloadOptions = { quality: 'highestvideo', filter: 'videoandaudio' };
    } else {
      downloadOptions = {
        quality: 'highestvideo',
        filter: (format) => format.qualityLabel === quality,
      };
    }
    videoStream = ytdl.downloadFromInfo(info, downloadOptions);
  }

  videoStream.on('error', (err) => {
    logger.error('Video stream error', { error: err.message });
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Download failed' });
    }
  });

  videoStream.on('progress', (chunkLength, downloaded, total) => {
    if (total) {
      res.setHeader('Content-Length', total);
    }
  });

  // Log download
  try {
    await Download.create({
      userId: req.user?._id,
      videoId: info._isYtdlp ? info.id : details.videoId,
      title: info._isYtdlp ? info.title : details.title,
      thumbnail: details.thumbnails?.[0]?.url,
      url,
      channelName: info._isYtdlp ? info.uploader : details.author?.name,
      duration: parseInt(info._isYtdlp ? info.duration : details.lengthSeconds),
      type: 'video',
      quality,
      format: 'mp4',
      status: 'completed',
      ipAddress: req.ip,
    });
  } catch (dbErr) {
    logger.warn('Failed to log download', { error: dbErr.message });
  }

  videoStream.pipe(res);
});

// GET /api/video/formats
const getFormats = asyncHandler(async (req, res) => {
  const { url } = req.query;

  if (!url || !isValidYouTubeUrl(url)) {
    return res.json({ success: true, data: { formats: VIDEO_QUALITIES } });
  }

  const info = await getVideoInfo(url);
  res.json({
    success: true,
    data: {
      formats: info.videoFormats,
      availableQualities: info.availableQualities,
    },
  });
});

module.exports = { downloadVideo, getFormats };
