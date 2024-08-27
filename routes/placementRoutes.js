const express = require('express');
const multer = require('multer');
const {
  getPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement,
  deletePlacement,
  getPlacementsCount,
} = require('../controllers/placementController');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.route('/')
  .get(getPlacements)
  .post(upload.single('studentImage'), createPlacement);

router.route('/count')
  .get(getPlacementsCount);

router.route('/:id')
  .get(getPlacementById)
  .put(upload.single('studentImage'), updatePlacement)
  .delete(deletePlacement);

module.exports = router;
