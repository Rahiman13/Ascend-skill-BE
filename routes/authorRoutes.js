const express = require('express');
const multer = require('multer');
const {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorCount,
} = require('../controllers/authorController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route('/')
  .get(getAuthors)
  .post(upload.single('image'), createAuthor);

router.route('/count')
  .get(getAuthorCount);

router.route('/:id')
  .get(getAuthorById)
  .put(upload.single('image'), updateAuthor)
  .delete(deleteAuthor);

module.exports = router;
