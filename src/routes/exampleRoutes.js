// const express = require('express');
// const router = express.Router();
// const exampleController = require('../controllers/exampleController');

// // Define your routes
// router.get('/', exampleController.getExamples);
// router.post('/', exampleController.createExample);
// // Add more routes as needed

// module.exports = router;

const express = require('express');
const router = express.Router();
const Example = require('../models/example');

// Get all examples
router.get('/', async (req, res) => {
  try {
    const examples = await Example.find();
    res.json(examples);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new example
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newExample = new Example({ name });
    await newExample.save();
    res.status(201).json(newExample);
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an example by ID
router.patch('/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const updatedExample = await Example.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedExample) {
      return res.status(404).json({ message: 'Example not found' });
    }
    res.json(updatedExample);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an example by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExample = await Example.findByIdAndDelete(id);
    if (!deletedExample) {
      return res.status(404).json({ message: 'Example not found' });
    }
    res.json({ message: 'Example deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
