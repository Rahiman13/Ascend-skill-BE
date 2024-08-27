const PhdHolder = require('../models/phdHolderModel');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});

// Get all PHD holders
const getPhdHolders = async (req, res) => {
  try {
    const phdHolders = await PhdHolder.find();
    res.json(phdHolders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get PHD holder by ID
const getPhdHolderById = async (req, res) => {
  try {
    const phdHolder = await PhdHolder.findById(req.params.id);
    if (phdHolder) {
      res.json(phdHolder);
    } else {
      res.status(404).json({ message: 'PHD holder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new PHD holder
const createPhdHolder = async (req, res) => {
  const { name, university, description, yearOfCompletion, publications } = req.body;
  let imageUrl = null;

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'phdholder_images',
      });
      imageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
  }

  const phdHolder = new PhdHolder({
    name,
    university,
    description,  // Updated from fieldOfStudy to description
    yearOfCompletion,
    publications,
    image: imageUrl,
  });

  try {
    const newPhdHolder = await phdHolder.save();
    res.status(201).json(newPhdHolder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a PHD holder
const updatePhdHolder = async (req, res) => {
  const { name, university, description, yearOfCompletion, publications } = req.body;
  let imageUrl = null;

  try {
    const phdHolder = await PhdHolder.findById(req.params.id);

    if (phdHolder) {
      phdHolder.name = name || phdHolder.name;
      phdHolder.university = university || phdHolder.university;
      phdHolder.description = description || phdHolder.description;  // Updated from fieldOfStudy to description
      phdHolder.yearOfCompletion = yearOfCompletion || phdHolder.yearOfCompletion;
      phdHolder.publications = publications || phdHolder.publications;

      if (req.file) {
        // Upload new image to Cloudinary
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'phdholder_images',
          });
          imageUrl = result.secure_url;

          // Delete the old image from Cloudinary
          if (phdHolder.image) {
            const publicId = phdHolder.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`phdholder_images/${publicId}`);
          }
        } catch (error) {
          return res.status(500).json({ message: 'Image upload failed', error: error.message });
        }

        phdHolder.image = imageUrl;
      }

      const updatedPhdHolder = await phdHolder.save();
      res.json(updatedPhdHolder);
    } else {
      res.status(404).json({ message: 'PHD holder not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a PHD holder
const deletePhdHolder = async (req, res) => {
  try {
    const phdHolder = await PhdHolder.findById(req.params.id);

    if (phdHolder) {
      // Delete the image from Cloudinary
      if (phdHolder.image) {
        const publicId = phdHolder.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`phdholder_images/${publicId}`);
      }

      await PhdHolder.deleteOne({ _id: req.params.id });
      res.json({ message: 'PHD holder removed' });
    } else {
      res.status(404).json({ message: 'PHD holder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total count of PHD holders
const getPhdHolderCount = async (req, res) => {
  try {
    const count = await PhdHolder.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPhdHolders,
  getPhdHolderById,
  createPhdHolder,
  updatePhdHolder,
  deletePhdHolder,
  getPhdHolderCount,
};
