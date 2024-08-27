const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  institution: {
    type: String,
  },
  year: {
    type: Number,
  },
}, {
  _id: false // Disable _id for subdocuments
});

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  position: {
    type: String,
  },
  experience: {
    type: Number,
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },
  degrees: [degreeSchema],
}, {
  timestamps: true,
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
