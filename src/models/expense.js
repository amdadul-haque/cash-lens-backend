const mongoose = require('mongoose');

// Define a schema for an example
const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

// Create a model based on the schema
const expense = mongoose.model('expense', expenseSchema);

module.exports = expense;
