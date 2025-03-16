const express = require('express');
const router = express.Router();
const stockOutHistoryController = require('../controllers/stockOutHistoryController');

// @route   GET /api/stock-out-history
// @desc    Get all stock out history
router.get('/', stockOutHistoryController.getStockOutHistory);

// @route   GET /api/stock-out-history/date/:date
// @desc    Get stock out history by date
router.get('/date/:date', stockOutHistoryController.getStockOutHistoryByDate);

// @route   GET /api/stock-out-history/range
// @desc    Get stock out history by date range
router.get('/range', stockOutHistoryController.getStockOutHistoryByDateRange);

// @route   POST /api/stock-out-history
// @desc    Create stock out history
router.post('/', stockOutHistoryController.createStockOutHistory);

module.exports = router; 