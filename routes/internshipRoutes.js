const express = require('express');
const multer = require('multer');
const { 
  getInternships, 
  getInternshipById, 
  createInternship, 
  updateInternship, 
  deleteInternship, 
  getInternshipCount 
} = require('../controllers/internshipController');

const router = express.Router();

// Set up multer for image uploads
const upload = multer({ dest: 'uploads/' });

// Routes
// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
router.get('/', getInternships);

// @desc    Get internship by ID
// @route   GET /api/internships/:id
// @access  Public
router.get('/:id', getInternshipById);

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Public
// Note: Use upload.single('image') to handle a single file upload with the key 'image'
router.post('/', upload.single('image'), createInternship);

// @desc    Update an internship
// @route   PUT /api/internships/:id
// @access  Public
// Note: Use upload.single('image') to handle a single file upload with the key 'image'
router.put('/:id', upload.single('image'), updateInternship);

// @desc    Delete an internship
// @route   DELETE /api/internships/:id
// @access  Public
router.delete('/:id', deleteInternship);

// @desc    Get total count of internships
// @route   GET /api/internships/count
// @access  Public
router.get('/count', getInternshipCount);

module.exports = router;
