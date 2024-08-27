const express = require('express');
const {
  getColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegeCount,
} = require('../controllers/collegeController');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.route('/')
  .get(getColleges)
  .post(upload.single('logo'), createCollege);

router.route('/count')
  .get(getCollegeCount)
  
router.route('/:id')
  .get(getCollegeById)
  .put(upload.single('logo'), updateCollege)
  .delete(deleteCollege);

module.exports = router;
