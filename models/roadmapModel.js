// models/roadmapModel.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  contents: [
    {
      type: String,
      required: true,
    }
  ]
}, {
  _id: false
});

const roadmapSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  title: {
    type: String,
    required: true,
  },
  contents: [contentSchema],
}, {
  timestamps: true,
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

module.exports = Roadmap;
