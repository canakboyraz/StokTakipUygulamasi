const mongoose = require('mongoose');

const StockOutHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      productBrand: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      cost: {
        type: Number,
        required: true
      }
    }
  ],
  totalCost: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('StockOutHistory', StockOutHistorySchema); 