const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const Review = require('../models/reviewModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});


// Configure multer for Cloudinary upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'review_images', // Cloudinary folder name
    allowedFormats: ['jpeg', 'jpg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage });

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('courseId', 'title').populate('userId', 'username');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('courseId', 'title').populate('userId', 'username');
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { courseId, userId, rating, comment } = req.body;
    const image = req.file ? req.file.path : ''; // Cloudinary URL

    const review = new Review({
      courseId,
      userId,
      rating,
      comment,
      image,
    });

    try {
      const newReview = await review.save();
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Public
const updateReview = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { rating, comment } = req.body;
    const newImage = req.file ? req.file.path : '';

    try {
      const review = await Review.findById(req.params.id);

      if (review) {
        // Delete the old image from Cloudinary if there's a new image
        if (newImage && review.image) {
          const publicId = review.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`review_images/${publicId}`);
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        if (newImage) {
          review.image = newImage;
        }

        const updatedReview = await review.save();
        res.json(updatedReview);
      } else {
        res.status(404).json({ message: 'Review not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Public
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      // Delete the image from Cloudinary
      if (review.image) {
        const publicId = review.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`review_images/${publicId}`);
      }

      await Review.deleteOne({ _id: req.params.id });
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total count of reviews
// @route   GET /api/reviews/count
// @access  Public
const getReviewCount = async (req, res) => {
  try {
    const count = await Review.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewCount,
};
