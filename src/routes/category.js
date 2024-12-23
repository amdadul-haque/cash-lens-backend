const express = require('express');
const router = express.Router();
const category = require('../models/category');

router.get('/', async (req, res) => {
  try {
    const categories = await category.find();
    res.json({
      status: true,
      message: 'Fetched categories successfully',
      total: categories.length,
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Server error',
      data: null
    });
  }
});

router.post('/add', async (req, res) => {
  const { name } = req.body;
  const errors = [];
  if (!name) {
    errors.push('Name is required.');
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const newCategory = new category({ name });
    await newCategory.save();
    res.json({
      status: true,
      message: 'Category added successfully',
      data: newCategory
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Server error',
      data: null
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({
        status: false,
        message: 'Category not found',
        data: null
      });
    }
    res.json({
      status: true,
      message: 'Category deleted successfully',
      data: deletedCategory
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Server error',
      data: null
    });
  }
});

router.patch('/update/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const updatedCategory = await category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({
        status: false,
        message: 'Category not found',
        data: null
      });
    }
    res.json({
      status: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Server error',
      data: null
    });
  }});

module.exports = router;