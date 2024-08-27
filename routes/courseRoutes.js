const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCount,
  getCourseDetails,
} = require('../controllers/courseController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', getCourses);
router.get('/count', getCourseCount); // Add this line
router.get('/:id', getCourseById);
router.get('/details/:id', getCourseDetails); // Add this line for detailed course info
router.post('/', upload.fields([{ name: 'authorImage' }, { name: 'image' }]), createCourse);
router.put('/:id', upload.fields([{ name: 'authorImage' }, { name: 'image' }]), updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;