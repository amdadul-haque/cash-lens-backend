const express = require('express');
const router = express.Router();
const expense = require('../models/expense');

router.get('/', async (req, res) => {
  try {
    const expenses = await expense.find();
    res.json({
      status: true,
      message: 'Fetched expenses successfully',
      total: expenses.length,
      data: expenses.sort((a, b) => a.date - b.date) // You can keep your sorting logic here
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Server error',
      data: null
    });
  }
});


router.get('/total', async (req, res) => {
  try {
    const total = await expense.aggregate([
      {
        $group: {
          _id: null, // No grouping needed; we want the total across all documents
          totalAmount: { $sum: '$amount' } // Sum the 'amount' field
        }
      }
    ]);

    res.json({ 
      status: true,
      message: 'Fetched total expenses successfully',
      totalAmount: total.length > 0 ? total[0].totalAmount : 0 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add', async (req, res) => {
  const { name, amount, category, date } = req.body;
  const errors = [];
  if (!name) {
    errors.push('Name is required.');
  }
  if (!amount) {
    errors.push('Amount is required.');
  } else if (typeof amount !== 'number') {
    errors.push('Amount must be a number.');
  }
  if (!category) {
    errors.push('Category is required.');
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const newExpense = new expense({ name, amount, category, date });
    await newExpense.save();
    // res.status(201).json(newExpense);
    // return the newly created expense with status true and message Expense added successfully
    res.json({ status: true, message: 'Expense added successfully', data: newExpense });
    
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, amount, category, date } = req.body;
  try {
    const updatedExpense = await expense.findByIdAndUpdate(id, { name, amount, category, date }, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(
      { 
        status: true, 
        message: 'Expense updated successfully', 
        data: updatedExpense 
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExpense = await expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({status:true, message: ' deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;