const Author = require('../models/authorModel');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});

// Get all authors
const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find()
      .populate('courseId', 'title description duration price image courseRating category authorName authorImage')
      .populate('authorReviews.userId', 'username');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get author by ID
const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
      .populate('courseId', 'title description duration price image courseRating category authorName authorImage')
      .populate('authorReviews.userId', 'username');
    if (author) {
      res.json(author);
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new author
const createAuthor = async (req, res) => {
  try {
    const { name, courseId, bio, authorReviews, degrees, experience, previousCompany } = req.body;
    let imageUrl = null;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'author_images',
        });
        imageUrl = result.secure_url;
      } catch (error) {
        return res.status(500).json({ message: 'Image upload failed', error: error.message });
      }
    }

    let parsedAuthorReviews;
    let parsedDegrees;

    try {
      parsedAuthorReviews = typeof authorReviews === 'string' ? JSON.parse(authorReviews) : authorReviews;
      parsedDegrees = typeof degrees === 'string' ? JSON.parse(degrees) : degrees;
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON format in authorReviews or degrees' });
    }

    const author = new Author({
      name,
      courseId,
      bio,
      image: imageUrl,
      authorReviews: parsedAuthorReviews,
      degrees: parsedDegrees,
      experience,
      previousCompany,
    });

    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an author
const updateAuthor = async (req, res) => {
  try {
    const { name, courseId, bio, authorReviews, degrees, experience, previousCompany } = req.body;
    let imageUrl = null;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'author_images',
        });
        imageUrl = result.secure_url;

        // Delete the old image from Cloudinary
        const author = await Author.findById(req.params.id);
        if (author && author.image) {
          const publicId = author.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`author_images/${publicId}`);
        }
      } catch (error) {
        return res.status(500).json({ message: 'Image upload failed', error: error.message });
      }
    }

    let parsedAuthorReviews;
    let parsedDegrees;

    try {
      parsedAuthorReviews = typeof authorReviews === 'string' ? JSON.parse(authorReviews) : authorReviews;
      parsedDegrees = typeof degrees === 'string' ? JSON.parse(degrees) : degrees;
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON format in authorReviews or degrees' });
    }

    const author = await Author.findById(req.params.id);

    if (author) {
      author.name = name || author.name;
      author.courseId = courseId || author.courseId;
      author.bio = bio || author.bio;
      author.authorReviews = parsedAuthorReviews || author.authorReviews;
      author.degrees = parsedDegrees || author.degrees;
      author.experience = experience || author.experience;
      author.previousCompany = previousCompany || author.previousCompany;
      author.image = imageUrl || author.image;

      const updatedAuthor = await author.save();
      res.json(updatedAuthor);
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an author
const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (author) {
      // Delete the image from Cloudinary
      if (author.image) {
        const publicId = author.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`author_images/${publicId}`);
      }

      await Author.deleteOne({ _id: req.params.id });
      res.json({ message: 'Author removed' });
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total count of authors
const getAuthorCount = async (req, res) => {
  try {
    const count = await Author.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorCount,
};
