const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://amdadul1807107:DNJ8evzzuxWKjvV4@cluster0.sjniy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Define your routes here
const exampleRoutes = require('./routes/exampleRoutes');
app.use('/api/example', exampleRoutes);

const expenseRoutes = require('./routes/expense');
app.use('/api/expense', expenseRoutes);

const categoryRoutes = require('./routes/category');
app.use('/api/category', categoryRoutes);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});