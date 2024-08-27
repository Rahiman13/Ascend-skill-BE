const mongoose = require('mongoose');

const phdHolderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  university: {
    type: String,
  },
  description: {
    type: String,  // Changed fieldOfStudy to description
  },
  yearOfCompletion: {
    type: Number,
  },
  publications: {
    type: [String], // Array of publication titles
    default: [],
  },
  image: {
    type: String, // Path to the uploaded image
    required: false,
  },
}, {
  timestamps: true,
});

const PhdHolder = mongoose.model('PhdHolder', phdHolderSchema);

module.exports = PhdHolder;
