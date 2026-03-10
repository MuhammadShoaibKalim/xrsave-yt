const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    totalDownloads: {
      type: Number,
      default: 0,
    },
    byType: {
      video: { type: Number, default: 0 },
      audio: { type: Number, default: 0 },
      thumbnail: { type: Number, default: 0 },
      subtitle: { type: Number, default: 0 },
      shorts: { type: Number, default: 0 },
    },
    uniqueUsers: {
      type: Number,
      default: 0,
    },
    popularVideos: [
      {
        videoId: String,
        title: String,
        count: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
