const ytdl = require('@distube/ytdl-core');
const { getInfoForDownload } = require('../services/ytdl.service');
const axios = require('axios');
const { convertAudioStream } = require('../services/ffmpeg.service');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const { isValidYouTubeUrl } = require('../utils/urlValidator');
const { sanitizeFilename, AUDIO_FORMATS } = require('../utils/formatHelper');
const Download = require('../models/Download.model');
const logger = require('../utils/logger');

// POST /api/audio/download
const downloadAudio = asyncHandler(async (req, res) => {
  const { url, format = 'mp3', quality = '192k' } = req.body;

  if (!isValidYouTubeUrl(url)) {
    throw new AppError('Invalid YouTube URL', 400, 'INVALID_URL');
  }

  const formatConfig = AUDIO_FORMATS.find((f) => f.value === format);
  if (!formatConfig) {
    throw new AppError('Invalid audio format', 400, 'INVALID_FORMAT');
  }

  const info = await getInfoForDownload(url);
  const details = info._isYtdlp ? info : info.videoDetails;

  const filename = sanitizeFilename(info._isYtdlp ? info.title : details.title);
  const safeFilename = encodeURIComponent(filename);
  const ext = formatConfig.ext;

  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.${ext}"; filename*=UTF-8''${safeFilename}.${ext}`);
  res.setHeader('Content-Type', `audio/${ext === 'mp3' ? 'mpeg' : ext}`);

  let audioStream;

  if (info._isYtdlp) {
    logger.info('Using yt-dlp audio stream fallback', { videoId: info.id });
    const format = info.formats.find(f => f.acodec !== 'none' && f.vcodec === 'none') ||
      info.formats.find(f => f.acodec !== 'none');

    if (!format || !format.url) throw new AppError('Could not find audio format via fallback', 500);

    // Pass URL directly to FFmpeg for much better stability than streaming through Axios
    audioStream = format.url;
  } else {
    // Create audio stream from highest quality audio
    audioStream = ytdl.downloadFromInfo(info, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });
  }

  if (typeof audioStream !== 'string') {
    audioStream.on('error', (err) => {
      logger.error('Audio stream error', { error: err.message });
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Download failed' });
      }
    });
  }

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
      type: 'audio',
      quality,
      format: ext,
      status: 'completed',
      ipAddress: req.ip,
    });
  } catch (dbErr) {
    logger.warn('Failed to log download', { error: dbErr.message });
  }

  // Convert and pipe to response
  try {
    await convertAudioStream(audioStream, format, formatConfig.bitrate, res);
  } catch (err) {
    logger.error('Audio conversion error', { error: err.message });
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Audio conversion failed' });
    }
  }
});

// GET /api/audio/formats
const getFormats = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { formats: AUDIO_FORMATS } });
});

module.exports = { downloadAudio, getFormats };
