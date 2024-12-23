const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define routes
const exampleRoutes = require('./routes/exampleRoutes');
app.use('/api/example', exampleRoutes);

const expenseRoutes = require('./routes/expense');
app.use('/api/expense', expenseRoutes);

const categoryRoutes = require('./routes/category');
app.use('/api/category', categoryRoutes);

module.exports = app;
