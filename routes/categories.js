const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// @route   GET /api/categories
// @desc    Get all categories
router.get('/', categoryController.getCategories);

// @route   POST /api/categories
// @desc    Add a category
router.post('/', categoryController.addCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 