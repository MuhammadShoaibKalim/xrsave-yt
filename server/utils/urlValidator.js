/**
 * YouTube URL validation utilities
 */

const YOUTUBE_DOMAINS = ['youtube.com', 'youtu.be', 'www.youtube.com', 'm.youtube.com'];

const YOUTUBE_URL_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /^https?:\/\/(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  /^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /^https?:\/\/(www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
];

const PLAYLIST_URL_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
  /^https?:\/\/(www\.)?youtube\.com\/watch\?.*list=([a-zA-Z0-9_-]+)/,
];

/**
 * Validate if a URL is a valid YouTube video URL
 */
const isValidYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(url.trim()));
};

/**
 * Validate if a URL is a valid YouTube playlist URL
 */
const isValidPlaylistUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return PLAYLIST_URL_PATTERNS.some((pattern) => pattern.test(url.trim()));
};

/**
 * Extract video ID from YouTube URL
 */
const extractVideoId = (url) => {
  if (!url) return null;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/**
 * Extract playlist ID from YouTube URL
 */
const extractPlaylistId = (url) => {
  if (!url) return null;
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

/**
 * Check if URL is a YouTube Shorts URL
 */
const isShortsUrl = (url) => {
  return /youtube\.com\/shorts\//.test(url);
};

/**
 * Normalize YouTube URL to standard format
 */
const normalizeUrl = (url) => {
  const videoId = extractVideoId(url);
  if (!videoId) return url;
  return `https://www.youtube.com/watch?v=${videoId}`;
};

module.exports = {
  isValidYouTubeUrl,
  isValidPlaylistUrl,
  extractVideoId,
  extractPlaylistId,
  isShortsUrl,
  normalizeUrl,
};
