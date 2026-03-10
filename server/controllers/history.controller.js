const Download = require('../models/Download.model');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');

// GET /api/history
const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const skip = (page - 1) * limit;

  const [downloads, total] = await Promise.all([
    Download.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Download.countDocuments({ userId: req.user._id }),
  ]);

  res.json({
    success: true,
    data: {
      downloads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    },
  });
});

// DELETE /api/history/:id
const deleteHistoryItem = asyncHandler(async (req, res) => {
  const download = await Download.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!download) {
    throw new AppError('History item not found', 404);
  }

  res.json({ success: true, message: 'History item deleted' });
});

// DELETE /api/history (clear all)
const clearHistory = asyncHandler(async (req, res) => {
  await Download.deleteMany({ userId: req.user._id });
  res.json({ success: true, message: 'Download history cleared' });
});

module.exports = { getHistory, deleteHistoryItem, clearHistory };
