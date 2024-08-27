const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
  },
  authorName: {
    type: String,
  },
  authorImage: {
    type: String,
  },
  authorId:{
    type: mongoose.Schema.Types.ObjectId,
  },
  // price: {
  //   type: Number,
  // },
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
  },
  curriculum: {
    type: Map,
    of: [String],
  },
  pricing:{
   type:String,
  },
  vedio:{
    type:String,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
  courseRating: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
