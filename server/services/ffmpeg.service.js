const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const os = require('os');
const logger = require('../utils/logger');

// Set ffmpeg path if provided, otherwise use ffmpeg-static
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
} else {
  try {
    const ffmpegPath = require('ffmpeg-static');
    if (ffmpegPath) {
      ffmpeg.setFfmpegPath(ffmpegPath);
      logger.info('🎬 FFmpeg path set automatically via ffmpeg-static');
    }
  } catch (err) {
    logger.warn('ffmpeg-static not found and FFMPEG_PATH not set. Ensure ffmpeg is in your system PATH.');
  }
}

/**
 * Convert audio stream to specified format and pipe to response
 */
const convertAudioStream = (inputStream, outputFormat, bitrate, res) => {
  return new Promise((resolve, reject) => {
    const formatMap = {
      mp3: 'mp3',
      mp3_192: 'mp3',
      mp3_128: 'mp3',
      m4a: 'ipod',
      wav: 'wav',
      ogg: 'ogg',
    };

    const ffmpegFormat = formatMap[outputFormat] || 'mp3';
    const audioBitrate = bitrate || (outputFormat === 'wav' ? null : '192k');

    let command = ffmpeg(inputStream);

    if (typeof inputStream === 'string' && inputStream.startsWith('http')) {
      // In fluent-ffmpeg, inputOptions apply to the last added input
      command = command.inputOptions([
        '-user_agent', 'googlebot',
        '-referer', 'https://www.youtube.com/'
      ]);
    }

    command = command
      .audioCodec(outputFormat === 'wav' ? 'pcm_s16le' : outputFormat === 'ogg' ? 'libvorbis' : 'libmp3lame')
      .format(ffmpegFormat);

    if (audioBitrate && outputFormat !== 'wav') {
      command = command.audioBitrate(audioBitrate);
    }

    command
      .on('error', (err) => {
        logger.error('ffmpeg conversion error', { error: err.message });
        reject(err);
      })
      .on('end', () => {
        resolve();
      })
      .pipe(res, { end: true });
  });
};

/**
 * Merge video and audio streams (for high quality downloads)
 * Returns path to temp file
 */
const mergeVideoAudio = (videoStream, audioStream) => {
  return new Promise((resolve, reject) => {
    const tmpFile = path.join(os.tmpdir(), `xrsave-yt-${Date.now()}.mp4`);

    // Save video stream temporarily
    const videoTmp = path.join(os.tmpdir(), `xrsave-yt-v-${Date.now()}.mp4`);
    const audioTmp = path.join(os.tmpdir(), `xrsave-yt-a-${Date.now()}.m4a`);

    const videoWriteStream = fs.createWriteStream(videoTmp);
    const audioWriteStream = fs.createWriteStream(audioTmp);

    let videoFinished = false;
    let audioFinished = false;

    const checkAndMerge = () => {
      if (!videoFinished || !audioFinished) return;

      ffmpeg()
        .input(videoTmp)
        .input(audioTmp)
        .outputOptions(['-c:v copy', '-c:a aac', '-movflags +faststart'])
        .output(tmpFile)
        .on('error', (err) => {
          cleanup([videoTmp, audioTmp]);
          reject(err);
        })
        .on('end', () => {
          cleanup([videoTmp, audioTmp]);
          resolve(tmpFile);
        })
        .run();
    };

    videoStream.pipe(videoWriteStream);
    audioStream.pipe(audioWriteStream);

    videoWriteStream.on('finish', () => { videoFinished = true; checkAndMerge(); });
    audioWriteStream.on('finish', () => { audioFinished = true; checkAndMerge(); });

    videoStream.on('error', reject);
    audioStream.on('error', reject);
  });
};

/**
 * Cleanup temp files
 */
const cleanup = (files) => {
  files.forEach((file) => {
    try {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch (err) {
      logger.warn('Failed to cleanup temp file', { file, error: err.message });
    }
  });
};

/**
 * Schedule cleanup with delay
 */
const scheduleCleanup = (files, delayMs = 60000) => {
  setTimeout(() => cleanup(files), delayMs);
};

module.exports = {
  convertAudioStream,
  mergeVideoAudio,
  cleanup,
  scheduleCleanup,
};
