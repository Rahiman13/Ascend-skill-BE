const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  countOfPlacedStudents: {
    type: Number,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
