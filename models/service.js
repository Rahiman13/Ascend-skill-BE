const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Service schema
const serviceSchema = new Schema({
  serviceTitle: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
});

// Create the Service model
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
