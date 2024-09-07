const express = require('express');
const multer = require('multer');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCount,
  getCourseDetails,
} = require('../controllers/courseController'); // Make sure this path is correct

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.route('/')
  .get(getCourses)  // This should be correctly imported and defined in the controller
  .post(upload.single('image'), createCourse);

router.route('/count')
  .get(getCourseCount); // Same here

router.route('/:id')
  // .get(getCourseById)  // And here
  .get(getCourseDetails)  // And here

  .put(upload.single('image'), updateCourse)
  .delete(deleteCourse);

module.exports = router;
