const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
  },
  duration: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  curriculum: {
    type: Map,
    of: [String],
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  description: {
    type: String,
  },
  authorName: {
    type: String,
  },
  image :{
    type:String,
  },
  review :{
    type:String,
  },
  pricing:{
    type:String,
  },
  video:{
    type:String,
  }
}, {
  timestamps: true,
});

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;
