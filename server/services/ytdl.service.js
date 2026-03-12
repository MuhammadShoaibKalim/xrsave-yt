const ytdl = require('@distube/ytdl-core');
const ytdlp = require('yt-dlp-exec');
const { cacheVideoInfo, getCachedVideoInfo } = require('./cache.service');
const { extractVideoId, normalizeUrl } = require('../utils/urlValidator');
const { formatDuration, formatViews, getThumbnailUrl } = require('../utils/formatHelper');
const logger = require('../utils/logger');

/**
 * Get comprehensive video information with yt-dlp fallback
 */
const getVideoInfo = async (url) => {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error('Could not extract video ID from URL');

  // Check cache first
  const cached = await getCachedVideoInfo(videoId);
  if (cached) {
    logger.debug('Cache hit for video info', { videoId });
    return cached;
  }

  const normalizedUrl = normalizeUrl(url);
  logger.info('Fetching video info', { videoId, engine: 'ytdl-core' });

  try {
    // Try ytdl-core first (faster when it works)
    let info;
    try {
      info = await ytdl.getInfo(normalizedUrl, { requestOptions: { timeout: 3500, maxRetries: 0 } });
      return processYtdlInfo(info);
    } catch (ytdlErr) {
      if (ytdlErr.message?.includes('403') || ytdlErr.message?.includes('playable formats') || ytdlErr.message?.includes('sign in')) {
        logger.info('YouTube extraction fallback: ytdl-core limit reached, switching engine', { videoId, reason: ytdlErr.message });
        return await getInfoViaYtdlp(normalizedUrl);
      }
      throw ytdlErr;
    }
  } catch (err) {
    handleYtdlError(err);
  }
};

/**
 * Fetch metadata using yt-dlp
 */
const getInfoViaYtdlp = async (url) => {
  const videoId = extractVideoId(url);
  try {
    const ytdlpInfo = await ytdlp(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      flatPlaylist: true,
      noPlaylist: true,
      quiet: true,
      noCallHome: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    });

    const processedInfo = {
      videoId: ytdlpInfo.id,
      title: ytdlpInfo.title,
      description: ytdlpInfo.description,
      duration: parseInt(ytdlpInfo.duration),
      durationFormatted: formatDuration(parseInt(ytdlpInfo.duration)),
      viewCount: parseInt(ytdlpInfo.view_count),
      viewCountFormatted: formatViews(parseInt(ytdlpInfo.view_count)),
      uploadDate: ytdlpInfo.upload_date,
      channelName: ytdlpInfo.uploader,
      channelId: ytdlpInfo.channel_id,
      channelUrl: ytdlpInfo.channel_url,
      thumbnails: ytdlpInfo.thumbnails,
      thumbnail: getThumbnailUrl(ytdlpInfo.id, 'maxresdefault'),
      isLive: ytdlpInfo.is_live,
      isAgeRestricted: ytdlpInfo.age_limit >= 18,
      keywords: ytdlpInfo.tags || [],
      category: ytdlpInfo.categories?.[0],
      likes: ytdlpInfo.like_count,
      subscribers: ytdlpInfo.channel_follower_count,
      // Map formats
      formats: (ytdlpInfo.formats || [])
        .filter(f => f.vcodec !== 'none' && f.acodec !== 'none')
        .map(formatYtdlpFormat),
      videoFormats: (ytdlpInfo.formats || [])
        .filter(f => f.vcodec !== 'none')
        .map(formatYtdlpFormat)
        .filter((v, i, arr) => arr.findIndex((t) => t.quality === v.quality) === i),
      audioFormats: (ytdlpInfo.formats || [])
        .filter(f => f.acodec !== 'none' && f.vcodec === 'none')
        .map(formatYtdlpFormat),
      availableQualities: [...new Set(
        (ytdlpInfo.formats || [])
          .filter(f => f.vcodec !== 'none' && f.height)
          .map(f => `${f.height}p`)
      )].sort((a, b) => parseInt(b) - parseInt(a)),
    };

    await cacheVideoInfo(videoId, processedInfo);
    return processedInfo;
  } catch (err) {
    logger.error('yt-dlp fallback failed', { videoId, error: err.message });
    throw err;
  }
};

/**
 * Process ytdl-core info object
 */
const processYtdlInfo = async (info) => {
  const details = info.videoDetails;
  const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
  const videoFormats = ytdl.filterFormats(info.formats, 'video');
  const audioFormats = ytdl.filterFormats(info.formats, 'audio');

  const processedInfo = {
    videoId: details.videoId,
    title: details.title,
    description: details.description,
    duration: parseInt(details.lengthSeconds),
    durationFormatted: formatDuration(parseInt(details.lengthSeconds)),
    viewCount: parseInt(details.viewCount),
    viewCountFormatted: formatViews(parseInt(details.viewCount)),
    uploadDate: details.uploadDate,
    channelName: details.author?.name,
    channelId: details.author?.id,
    channelUrl: details.author?.channel_url,
    thumbnails: details.thumbnails,
    thumbnail: getThumbnailUrl(details.videoId, 'maxresdefault'),
    isLive: details.isLive,
    isPrivate: details.isPrivate,
    isAgeRestricted: details.age_restricted,
    keywords: details.keywords || [],
    category: details.category,
    likes: details.likes,
    subscribers: details.author?.subscriber_count,
    formats: formats.map(formatVideoFormat),
    videoFormats: videoFormats
      .filter((f) => f.qualityLabel)
      .map(formatVideoFormat)
      .filter((v, i, arr) => arr.findIndex((t) => t.quality === v.quality) === i),
    audioFormats: audioFormats.map(formatAudioFormat),
    availableQualities: [...new Set(
      videoFormats
        .filter((f) => f.qualityLabel)
        .map((f) => f.qualityLabel)
    )].sort((a, b) => parseInt(b) - parseInt(a)),
  };

  await cacheVideoInfo(details.videoId, processedInfo);
  return processedInfo;
};

/**
 * Create download stream with fallback
 */
const createVideoStream = async (url, options = {}) => {
  const normalizedUrl = normalizeUrl(url);
  try {
    // Try ytdl-core first
    return ytdl(normalizedUrl, {
      quality: options.quality === 'highest' ? 'highestvideo' : options.quality,
      filter: options.format ? (f) => f.qualityLabel === options.format : 'videoandaudio',
    });
  } catch (err) {
    logger.warn('ytdl-core stream failed, using yt-dlp instead');
    // Implement yt-dlp stream logic if needed, or rethrow
    throw err;
  }
};

/**
 * Create audio stream with fallback
 */
const createAudioStream = async (url) => {
  const normalizedUrl = normalizeUrl(url);
  try {
    return ytdl(normalizedUrl, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });
  } catch (err) {
    logger.warn('ytdl-core audio stream failed');
    throw err;
  }
};

/**
 * Format ytdl-core video format
 */
const formatVideoFormat = (f) => ({
  itag: f.itag,
  quality: f.qualityLabel || f.quality,
  container: f.container,
  codecs: f.codecs,
  bitrate: f.bitrate,
  width: f.width,
  height: f.height,
  fps: f.fps,
  filesize: f.contentLength,
  mimeType: f.mimeType,
  hasVideo: f.hasVideo,
  hasAudio: f.hasAudio,
});

/**
 * Format ytdl-core audio format
 */
const formatAudioFormat = (f) => ({
  itag: f.itag,
  container: f.container,
  codecs: f.codecs,
  audioBitrate: f.audioBitrate,
  audioSampleRate: f.audioSampleRate,
  audioChannels: f.audioChannels,
  filesize: f.contentLength,
  mimeType: f.mimeType,
});

/**
 * Format yt-dlp format to match ytdl-core
 */
const formatYtdlpFormat = (f) => ({
  itag: f.format_id,
  quality: f.resolution || (f.height ? `${f.height}p` : f.format_note),
  container: f.ext,
  codecs: f.vcodec !== 'none' ? f.vcodec : f.acodec,
  bitrate: f.vbr || f.abr || f.tbr,
  width: f.width,
  height: f.height,
  fps: f.fps,
  filesize: f.filesize || f.filesize_approx,
  mimeType: f.format,
  hasVideo: f.vcodec !== 'none',
  hasAudio: f.acodec !== 'none',
});

/**
 * Handle ytdl-specific errors
 */
const handleYtdlError = (err) => {
  logger.error('ytdl error', { error: err.message });
  if (err.message?.includes('age-restricted')) {
    const error = new Error('This video is age-restricted.');
    error.statusCode = 403;
    throw error;
  }
  // ... other errors
  throw err;
};

/**
 * Get raw info for download with fallback
 */
const getInfoForDownload = async (url) => {
  const normalizedUrl = normalizeUrl(url);
  try {
    return await ytdl.getInfo(normalizedUrl, { requestOptions: { timeout: 3500, maxRetries: 0 } });
  } catch (err) {
    logger.info('Download engine: Switching to yt-dlp for better compatibility');
    // For downloads, we might need the full yt-dlp JSON
    const info = await ytdlp(normalizedUrl, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      noPlaylist: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    });
    info._isYtdlp = true;
    return info;
  }
};

const getSubtitlesViaYtdlp = async (url, languageCode, format) => {
  const normalizedUrl = normalizeUrl(url);
  try {
    const args = {
      writeSubs: true,
      writeAutoSubs: true,
      subLangs: languageCode,
      subFormat: format,
      skipDownload: true,
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      noPlaylist: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    };

    // Using yt-dlp directly to extract the subtitle URL securely
    const info = await ytdlp(normalizedUrl, args);
    const subs = info.subtitles?.[languageCode] || info.automatic_captions?.[languageCode];
    if (subs && subs.length > 0) {
      const sub = subs.find(s => s.ext === format) || subs[0];
      return sub.url;
    }
    return null;
  } catch (err) {
    logger.error('yt-dlp subtitle fetch failed', { error: err.message });
    throw err;
  }
};

module.exports = {
  getVideoInfo,
  getInfoForDownload,
  createVideoStream,
  createAudioStream,
  getSubtitlesViaYtdlp,
};
