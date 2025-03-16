const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// @route   GET /api/products
// @desc    Get all products
router.get('/', productController.getProducts);

// @route   POST /api/products
// @desc    Add a product
router.post('/', productController.addProduct);

// @route   GET /api/products/:id
// @desc    Get product by ID
router.get('/:id', productController.getProductById);

// @route   PUT /api/products/:id
// @desc    Update product
router.put('/:id', productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
router.delete('/:id', productController.deleteProduct);

// @route   PATCH /api/products/:id/quantity
// @desc    Update product quantity (for stock out)
router.patch('/:id/quantity', productController.updateQuantity);

module.exports = router; 