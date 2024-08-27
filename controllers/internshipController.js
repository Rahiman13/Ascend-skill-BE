const cloudinary = require('cloudinary').v2;
const Internship = require('../models/internshipModel');

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});


// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find().populate('instructorId');
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get internship by ID
// @route   GET /api/internships/:id
// @access  Public
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('instructorId');
    if (internship) {
      res.json(internship);
    } else {
      res.status(404).json({ message: 'Internship not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Public
const createInternship = async (req, res) => {
  const { courseTitle, duration, startDate, endDate, curriculum, instructorId, description, authorName, review, pricing, video } = req.body;

  let parsedCurriculum;
  try {
    parsedCurriculum = typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum;
  } catch (error) {
    return res.status(400).json({ message: 'Curriculum must be a valid JSON object' });
  }

  let imageUrl = '';
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'intern_images',
      });
      imageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
  }

  const internship = new Internship({
    courseTitle,
    duration,
    startDate,
    endDate,
    curriculum: parsedCurriculum,
    instructorId,
    description,
    authorName,
    image: imageUrl,
    review,
    pricing,
    video,  // Storing video link
  });

  try {
    const newInternship = await internship.save();
    res.status(201).json(newInternship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc    Update an internship
// @route   PUT /api/internships/:id
// @access  Public
const updateInternship = async (req, res) => {
  const { courseTitle, duration, startDate, endDate, curriculum, instructorId, description, authorName, review, pricing, video } = req.body;

  let parsedCurriculum;
  try {
    parsedCurriculum = typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum;
  } catch (error) {
    return res.status(400).json({ message: 'Curriculum must be a valid JSON object' });
  }

  try {
    const internship = await Internship.findById(req.params.id);

    if (internship) {
      if (req.file) {
        // If there's an existing image, delete it from Cloudinary
        if (internship.image) {
          const publicId = internship.image.split('/').pop().split('.')[0]; // Extract public ID from URL
          await cloudinary.uploader.destroy(`intern_images/${publicId}`);
        }

        // Upload the new image
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'intern_images',
          });
          internship.image = result.secure_url;
        } catch (error) {
          return res.status(500).json({ message: 'Image upload failed', error: error.message });
        }
      }

      internship.courseTitle = courseTitle || internship.courseTitle;
      internship.duration = duration || internship.duration;
      internship.startDate = startDate || internship.startDate;
      internship.endDate = endDate || internship.endDate;
      internship.curriculum = parsedCurriculum || internship.curriculum;
      internship.instructorId = instructorId || internship.instructorId;
      internship.description = description || internship.description;
      internship.authorName = authorName || internship.authorName;
      internship.review = review || internship.review;
      internship.pricing = pricing || internship.pricing;
      internship.video = video || internship.video; // Updating video link

      const updatedInternship = await internship.save();
      res.json(updatedInternship);
    } else {
      res.status(404).json({ message: 'Internship not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc    Delete an internship
// @route   DELETE /api/internships/:id
// @access  Public
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (internship) {
      // Delete image from Cloudinary if it exists
      if (internship.image) {
        const publicId = internship.image.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(`intern_images/${publicId}`);
      }

      await Internship.deleteOne({ _id: req.params.id });
      res.json({ message: 'Internship removed' });
    } else {
      res.status(404).json({ message: 'Internship not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get total count of internships
// @route   GET /api/internships/count
// @access  Public
const getInternshipCount = async (req, res) => {
  try {
    const count = await Internship.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  getInternshipCount,
};
