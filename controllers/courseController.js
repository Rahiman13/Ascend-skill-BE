const cloudinary = require('cloudinary').v2;
const Course = require('../models/courseModel');
const Author = require('../models/authorModel');  // Assuming you have an Author model
const Review = require('../models/reviewModel');  // Assuming you have a Review model

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dmst4lbrx',
  api_key: '828194579658255',
  api_secret: '4hij7lz9E3GNXkFgGW6XnvJ1DFo',
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('authorId reviews');
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
    const course = await Course.findById(req.params.id).populate('authorId reviews');
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
  const { title, description, duration, authorId, price, category, curriculum, pricing, vedio, reviews, courseRating } = req.body;

  let parsedCurriculum;
  try {
    parsedCurriculum = typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum;
  } catch (error) {
    return res.status(400).json({ message: 'Curriculum must be a valid JSON object' });
  }

  let parsedReviews;
  try {
    parsedReviews = Array.isArray(reviews) ? reviews.map(review => mongoose.Types.ObjectId(review)) : [];
  } catch (error) {
    return res.status(400).json({ message: 'Reviews must be an array of valid ObjectId strings' });
  }

  let imageUrl = '';
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_images',
      });
      imageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
  }

  try {
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const course = new Course({
      title,
      description,
      duration,
      author: author.name,
      authorImage: author.image,
      authorId,
      price,
      image: imageUrl,
      category,
      curriculum: parsedCurriculum,
      pricing,
      vedio,
      reviews: parsedReviews,
      courseRating,
    });

    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error); // Log error for debugging
    res.status(400).json({ message: error.message });
  }
};


// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Public
const updateCourse = async (req, res) => {
  const { title, description, duration, authorId, price, category, curriculum, pricing, vedio, reviews, courseRating } = req.body;

  let parsedCurriculum;
  try {
    parsedCurriculum = typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum;
  } catch (error) {
    return res.status(400).json({ message: 'Curriculum must be a valid JSON object' });
  }

  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Handle image upload if a file is provided
    if (req.file) {
      // Delete the existing image if present
      if (course.image) {
        const publicId = course.image.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(`course_images/${publicId}`);
      }

      // Upload the new image
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'course_images',
        });
        course.image = result.secure_url;
      } catch (error) {
        return res.status(500).json({ message: 'Image upload failed', error: error.message });
      }
    }

    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Update the course fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.duration = duration || course.duration;
    course.author = author.name || course.author;
    course.authorImage = author.image || course.authorImage;
    course.authorId = authorId || course.authorId;
    course.price = price || course.price;
    course.category = category || course.category;
    course.curriculum = parsedCurriculum || course.curriculum;
    course.pricing = pricing || course.pricing;
    course.vedio = vedio || course.vedio;
    course.reviews = reviews || course.reviews;
    course.courseRating = courseRating || course.courseRating;

    // Save the updated course
    const updatedCourse = await course.save();
    res.json(updatedCourse);
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
      // Delete image from Cloudinary if it exists
      if (course.image) {
        const publicId = course.image.split('/').pop().split('.')[0]; // Extract public ID from URL
        console.log('Deleting Cloudinary image with public ID:', publicId);
        await cloudinary.uploader.destroy(`course_images/${publicId}`);
      }

      const result = await Course.deleteOne({ _id: req.params.id });
      console.log('Delete result:', result);
      
      if (result.deletedCount === 1) {
        res.json({ message: 'Course removed' });
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
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


// Get author details
// Get course details with reviews, instructor, roadmap, and video reviews
const getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const reviews = await Review.find({ courseId }).populate('userId', 'username');
    // const vedio = await VideoReview.find({ courseId }).populate('userId', 'username');
    const author = await Author.findOne({ _id: course.authorId });
    // const roadmap = await Roadmap.findOne({ courseId });

    res.json({
      course,
      reviews,
      // vedio,
      author,
      // roadmap,
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
