/**
 * Format and quality helpers
 */

const VIDEO_QUALITIES = [
  { label: '4K (2160p)', value: '2160', itag: 313, container: 'mp4' },
  { label: '1440p (2K)', value: '1440', itag: 271, container: 'mp4' },
  { label: '1080p (Full HD)', value: '1080', itag: 137, container: 'mp4' },
  { label: '720p (HD)', value: '720', itag: 136, container: 'mp4' },
  { label: '480p', value: '480', itag: 135, container: 'mp4' },
  { label: '360p', value: '360', itag: 134, container: 'mp4' },
  { label: '240p', value: '240', itag: 133, container: 'mp4' },
  { label: '144p', value: '144', itag: 160, container: 'mp4' },
];

const AUDIO_FORMATS = [
  { label: 'MP3 - 320kbps', value: 'mp3', bitrate: '320k', ext: 'mp3' },
  { label: 'MP3 - 192kbps', value: 'mp3_192', bitrate: '192k', ext: 'mp3' },
  { label: 'MP3 - 128kbps', value: 'mp3_128', bitrate: '128k', ext: 'mp3' },
  { label: 'M4A - High Quality', value: 'm4a', bitrate: '256k', ext: 'm4a' },
  { label: 'WAV - Lossless', value: 'wav', bitrate: null, ext: 'wav' },
  { label: 'OGG Vorbis', value: 'ogg', bitrate: '192k', ext: 'ogg' },
];

const THUMBNAIL_QUALITIES = [
  { label: 'Max Resolution (1280x720)', value: 'maxresdefault', suffix: 'maxresdefault' },
  { label: 'High Quality (480x360)', value: 'hqdefault', suffix: 'hqdefault' },
  { label: 'Medium Quality (320x180)', value: 'mqdefault', suffix: 'mqdefault' },
  { label: 'Standard Quality (120x90)', value: 'sddefault', suffix: 'sddefault' },
  { label: 'Default (120x90)', value: 'default', suffix: 'default' },
];

const SUBTITLE_FORMATS = [
  { label: 'SRT (SubRip)', value: 'srt', ext: 'srt' },
  { label: 'VTT (WebVTT)', value: 'vtt', ext: 'vtt' },
  { label: 'Plain Text', value: 'txt', ext: 'txt' },
];

/**
 * Get thumbnail URL for a video
 */
const getThumbnailUrl = (videoId, quality = 'maxresdefault') => {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Format file size to human-readable
 */
const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Format duration in seconds to HH:MM:SS
 */
const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * Format view count
 */
const formatViews = (count) => {
  if (!count) return '0';
  if (count >= 1e9) return `${(count / 1e9).toFixed(1)}B`;
  if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M`;
  if (count >= 1e3) return `${(count / 1e3).toFixed(1)}K`;
  return count.toString();
};

/**
 * Sanitize filename for download
 */
const sanitizeFilename = (name) => {
  return name
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '_')
    .substring(0, 200);
};

module.exports = {
  VIDEO_QUALITIES,
  AUDIO_FORMATS,
  THUMBNAIL_QUALITIES,
  SUBTITLE_FORMATS,
  getThumbnailUrl,
  formatFileSize,
  formatDuration,
  formatViews,
  sanitizeFilename,
};
