const express = require('express');
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewCount,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post( createReview);

router.route('/count')
  .get(getReviewCount);

router.route('/:id')
  .get(getReviewById)
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;
