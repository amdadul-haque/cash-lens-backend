const express = require('express');
const router = express.Router();
const expense = require('../models/expense');

router.get('/', async (req, res) => {
  try {
    const { from_date, to_date } = req.query;

    // Parse and validate dates
    const fromDate = from_date ? new Date(from_date) : null;
    const toDate = to_date ? new Date(to_date) : null;

    // Fetch all expenses
    let expenses = await expense.find();

    // Filter expenses by date range if provided
    if (fromDate && toDate) {
      expenses = expenses.filter(
        (item) =>
          new Date(item.date) >= fromDate && new Date(item.date) <= toDate
      );
    } else if (fromDate) {
      expenses = expenses.filter((item) => new Date(item.date) >= fromDate);
    } else if (toDate) {
      expenses = expenses.filter((item) => new Date(item.date) <= toDate);
    }

    // Calculate total amount of filtered data
    const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Transform the filtered data by category
    const transformedData = Object.values(
      expenses.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = { category, items: [], totalItems: 0, totalAmount: 0 };
        }
        acc[category].totalItems += 1;
        acc[category].totalAmount += item.amount;
        acc[category].items.push(item);
        return acc;
      }, {})
    );

    res.json({
      status: true,
      message: 'Fetched expenses successfully',
      totalAmount,
      itemCount: expenses.length,
      data: transformedData
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


const categoryModel = require('../models/category');

router.post('/add', async (req, res) => {
  const { name, amount, category, date } = req.body;
  const errors = [];

  // Validate input fields
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
    // Check if the category exists
    const categoryExists = await categoryModel.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({ 
        status: false, 
        message: `Category '${category}' does not exist.` 
      });
    }

    // Create and save the new expense
    const expenseDate = date ? new Date(date) : new Date();
    const newExpense = new expense({ name, amount, category, date: expenseDate });
    await newExpense.save();

    res.json({
      status: true,
      message: 'Expense added successfully',
      data: newExpense
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'Server error',
    });
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