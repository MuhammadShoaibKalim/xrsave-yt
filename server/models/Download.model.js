const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    videoId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 500,
    },
    thumbnail: String,
    url: {
      type: String,
      required: true,
    },
    channelName: String,
    duration: Number,
    type: {
      type: String,
      enum: ['video', 'audio', 'thumbnail', 'subtitle', 'shorts'],
      required: true,
    },
    quality: String,
    format: String,
    fileSize: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'completed',
    },
    errorMessage: String,
    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

// Compound indexes for frequent queries
downloadSchema.index({ userId: 1, createdAt: -1 });
downloadSchema.index({ videoId: 1, type: 1 });
downloadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Download', downloadSchema);
