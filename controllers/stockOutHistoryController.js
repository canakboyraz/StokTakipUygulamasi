const StockOutHistory = require('../models/StockOutHistory');
const Product = require('../models/Product');

// @desc    Get all stock out history
// @route   GET /api/stock-out-history
// @access  Public
exports.getStockOutHistory = async (req, res) => {
  try {
    const history = await StockOutHistory.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get stock out history by date
// @route   GET /api/stock-out-history/date/:date
// @access  Public
exports.getStockOutHistoryByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const history = await StockOutHistory.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create stock out history
// @route   POST /api/stock-out-history
// @access  Public
exports.createStockOutHistory = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Items are required' });
    }
    
    // Calculate total cost
    const totalCost = items.reduce((total, item) => total + item.cost, 0);
    
    // Create new history record
    const newHistory = new StockOutHistory({
      items,
      totalCost
    });
    
    // Update product quantities
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ msg: `Product with ID ${item.productId} not found` });
      }
      
      if (product.quantity < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
      }
      
      product.quantity -= item.quantity;
      await product.save();
    }
    
    const history = await newHistory.save();
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get stock out history by date range
// @route   GET /api/stock-out-history/range
// @access  Public
exports.getStockOutHistoryByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const history = await StockOutHistory.find({
      date: {
        $gte: start,
        $lte: end
      }
    }).sort({ date: -1 });
    
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 