const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const Review = require('../models/reviewModel');
const VideoReview = require('../models/videoReviewModel');
const Author = require('../models/authorModel');
const Roadmap = require('../models/roadmapModel');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'course_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public
const createCourse = async (req, res) => {
  const { title, description, duration, authorName, authorId, category, curriculum, pricing, vedio, courseRating } = req.body;

  let parsedCurriculum;
  try {
    parsedCurriculum = typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum;
  } catch (error) {
    return res.status(400).json({ message: 'Curriculum must be a valid JSON object' });
  }

  try {
    // Check if multer processed any files
    if (!req.files) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const authorImageFile = req.files['authorImage'] ? req.files['authorImage'][0] : null;
    const imageFile = req.files['image'] ? req.files['image'][0] : null;

    // Upload images to Cloudinary if they exist
    let authorImageUpload, imageUpload;
    if (authorImageFile) {
      authorImageUpload = await cloudinary.uploader.upload(authorImageFile.path, {
        folder: 'course_images',
      });
    }
    if (imageFile) {
      imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'course_images',
      });
    }

    const course = new Course({
      title,
      description,
      duration,
      authorName,
      authorId: mongoose.Types.ObjectId(authorId), // Ensure the authorId is stored as an ObjectId
      authorImage: authorImageUpload ? authorImageUpload.secure_url : '',
      image: imageUpload ? imageUpload.secure_url : '',
      // price,
      category,
      pricing,
      curriculum: parsedCurriculum,
      vedio,
      courseRating,
    });

    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Public
const updateCourse = async (req, res) => {
  const { title, description, duration, authorName, authorId, category, curriculum, pricing, vedio, courseRating } = req.body;

  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      course.title = title || course.title;
      course.description = description || course.description;
      course.duration = duration || course.duration;
      course.authorName = authorName || course.authorName;
      course.authorId = mongoose.Types.ObjectId(authorId) || course.authorId;
      // course.price = price || course.price;
      course.category = category || course.category;
      course.pricing = pricing || course.pricing;
      course.vedio = vedio || course.vedio;
      course.courseRating = courseRating || course.courseRating;

      let parsedCurriculum;
      try {
        parsedCurriculum = typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum;
      } catch (error) {
        return res.status(400).json({ message: 'Curriculum must be a valid JSON object' });
      }

      course.curriculum = parsedCurriculum || course.curriculum;

      // Update author image if provided
      if (req.files && req.files['authorImage']) {
        // Delete old image from Cloudinary if it exists
        if (course.authorImage) {
          const public_id = course.authorImage.split('/').pop().split('.')[0]; // Extract the public_id
          await cloudinary.uploader.destroy(`course_images/${public_id}`);
        }

        // Upload new image to Cloudinary
        const authorImageUpload = await cloudinary.uploader.upload(req.files['authorImage'][0].path, {
          folder: 'course_images',
        });

        course.authorImage = authorImageUpload.secure_url;
      }

      // Update course image if provided
      if (req.files && req.files['image']) {
        // Delete old image from Cloudinary if it exists
        if (course.image) {
          const public_id = course.image.split('/').pop().split('.')[0]; // Extract the public_id
          await cloudinary.uploader.destroy(`course_images/${public_id}`);
        }

        // Upload new image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(req.files['image'][0].path, {
          folder: 'course_images',
        });

        course.image = imageUpload.secure_url;
      }

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Public
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // If the course images exist, delete them from Cloudinary
      if (course.authorImage) {
        try {
          const public_id = course.authorImage.split('/').pop().split('.')[0]; // Extract the public_id
          await cloudinary.uploader.destroy(`course_images/${public_id}`);
        } catch (error) {
          console.error('Error deleting author image from Cloudinary:', error.message);
        }
      }

      if (course.image) {
        try {
          const public_id = course.image.split('/').pop().split('.')[0]; // Extract the public_id
          await cloudinary.uploader.destroy(`course_images/${public_id}`);
        } catch (error) {
          console.error('Error deleting course image from Cloudinary:', error.message);
        }
      }

      // Delete the course from the database
      await Course.deleteOne({ _id: req.params.id });

      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total count of courses
// @route   GET /api/courses/count
// @access  Public
const getCourseCount = async (req, res) => {
  try {
    const count = await Course.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course details with reviews, instructor, roadmap, and video reviews
// @route   GET /api/courses/:id/details
// @access  Public
const getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const reviews = await Review.find({ courseId }).populate('userId', 'username');
    const videoReviews = await VideoReview.find({ courseId }).populate('userId', 'username');
    const authorName = await Author.findOne({ _id: course.authorId });
    const roadmap = await Roadmap.findOne({ courseId });

    res.json({
      course,
      reviews,
      videoReviews,
      authorName,
      roadmap,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCount,
  getCourseDetails,
};
