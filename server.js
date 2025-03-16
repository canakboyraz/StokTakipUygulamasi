const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stok-takip';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const stockOutHistoryRoutes = require('./routes/stockOutHistory');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stock-out-history', stockOutHistoryRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 