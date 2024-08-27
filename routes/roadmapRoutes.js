// routes/roadmapRoutes.js
const express = require('express');
const {
  getRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  getRoadMapCount,
} = require('../controllers/roadmapController');

const router = express.Router();

router.route('/')
  .get(getRoadmaps)
  .post(createRoadmap);

router.route('/count')
  .get(getRoadMapCount);

router.route('/:id')
  .get(getRoadmapById)
  .put(updateRoadmap)
  .delete(deleteRoadmap);

module.exports = router;
