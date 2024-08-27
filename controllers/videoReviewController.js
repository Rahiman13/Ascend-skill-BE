const VideoReview = require('../models/videoReviewModel');

// @desc    Get all video reviews
// @route   GET /api/video-reviews
// @access  Public
const getVideoReviews = async (req, res) => {
  try {
    const videoReviews = await VideoReview.find().populate('courseId', 'title').populate('userId', 'username');
    res.json(videoReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get video review by ID
// @route   GET /api/video-reviews/:id
// @access  Public
const getVideoReviewById = async (req, res) => {
  try {
    const videoReview = await VideoReview.findById(req.params.id).populate('courseId', 'title').populate('userId', 'username');
    if (videoReview) {
      res.json(videoReview);
    } else {
      res.status(404).json({ message: 'Video review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new video review
// @route   POST /api/video-reviews
// @access  Public
const createVideoReview = async (req, res) => {
  const { title, videoUrl, userId, courseId, rating, comment } = req.body;

  const videoReview = new VideoReview({
    title,
    videoUrl,
    userId,
    courseId,
    rating,
    comment,
  });

  try {
    const newVideoReview = await videoReview.save();
    res.status(201).json(newVideoReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a video review
// @route   PUT /api/video-reviews/:id
// @access  Public
const updateVideoReview = async (req, res) => {
  const { title, videoUrl, rating, comment } = req.body;

  try {
    const videoReview = await VideoReview.findById(req.params.id);

    if (videoReview) {
      videoReview.title = title || videoReview.title;
      videoReview.videoUrl = videoUrl || videoReview.videoUrl;
      videoReview.rating = rating || videoReview.rating;
      videoReview.comment = comment || videoReview.comment;

      const updatedVideoReview = await videoReview.save();
      res.json(updatedVideoReview);
    } else {
      res.status(404).json({ message: 'Video review not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a video review
// @route   DELETE /api/video-reviews/:id
// @access  Public
const deleteVideoReview = async (req, res) => {
  try {
    const videoReview = await VideoReview.findById(req.params.id);

    if (videoReview) {
      await VideoReview.deleteOne({ _id: req.params.id });
      res.json({ message: 'Video review removed' });
    } else {
      res.status(404).json({ message: 'Video review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total count of video reviews
// @route   GET /api/video-reviews/count
// @access  Public
const getVideoReviewCount = async (req, res) => {
  try {
    const count = await VideoReview.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getVideoReviews,
  getVideoReviewById,
  createVideoReview,
  updateVideoReview,
  deleteVideoReview,
  getVideoReviewCount,
};
