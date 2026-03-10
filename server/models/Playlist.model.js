const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    playlistId: {
      type: String,
      required: true,
    },
    title: String,
    channelName: String,
    thumbnail: String,
    totalVideos: {
      type: Number,
      default: 0,
    },
    downloadedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'partial'],
      default: 'pending',
    },
    jobId: String,
    downloadType: {
      type: String,
      enum: ['video', 'audio'],
      default: 'video',
    },
    quality: String,
    format: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Playlist', playlistSchema);
