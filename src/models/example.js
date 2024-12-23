const mongoose = require('mongoose');

// Define a schema for an example
const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Create a model based on the schema
const Example = mongoose.model('Example', exampleSchema);

module.exports = Example;
