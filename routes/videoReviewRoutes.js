const express = require('express');
const {
  getVideoReviews,
  getVideoReviewById,
  createVideoReview,
  updateVideoReview,
  deleteVideoReview,
  getVideoReviewCount,
} = require('../controllers/videoReviewController');

const router = express.Router();

router.route('/')
  .get(getVideoReviews)
  .post(createVideoReview);

router.route('/count')
  .get(getVideoReviewCount);

router.route('/:id')
  .get(getVideoReviewById)
  .put(updateVideoReview)
  .delete(deleteVideoReview);

module.exports = router;
