const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const authorReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  courseId: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  }],
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  authorReviews: [authorReviewSchema],
  degrees: [degreeSchema],
  experience: {
    type: Number,
    required: true,
  },
  previousCompany: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
