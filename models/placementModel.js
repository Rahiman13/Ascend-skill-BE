const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  studentImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  studentCollege: {
    type: String,
    required: true,
  },
  placedYear: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Placement = mongoose.model('Placement', placementSchema);

module.exports = Placement;
