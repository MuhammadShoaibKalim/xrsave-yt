const express = require('express');
const router = express.Router();
const { getHistory, deleteHistoryItem, clearHistory } = require('../controllers/history.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All history routes require auth
router.get('/', getHistory);
router.delete('/clear', clearHistory);
router.delete('/:id', deleteHistoryItem);
module.exports = router;
