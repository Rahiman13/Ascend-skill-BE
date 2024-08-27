const Placement = require('../models/placementModel');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});

// @desc    Get all placements
// @route   GET /api/placements
// @access  Public
const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find();
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get placement by ID
// @route   GET /api/placements/:id
// @access  Public
const getPlacementById = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (placement) {
      res.json(placement);
    } else {
      res.status(404).json({ message: 'Placement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new placement
// @route   POST /api/placements
// @access  Public
const createPlacement = async (req, res) => {
  const { studentName, position, companyName, description, studentCollege, placedYear } = req.body;
  let studentImageUrl = null;

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'placed_images',
      });
      studentImageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
  }

  const placement = new Placement({
    studentName,
    position,
    companyName,
    studentImage: studentImageUrl,
    description,
    studentCollege,
    placedYear,
  });

  try {
    const newPlacement = await placement.save();
    res.status(201).json(newPlacement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a placement
// @route   PUT /api/placements/:id
// @access  Public
const updatePlacement = async (req, res) => {
  const { studentName, position, companyName, description, studentCollege, placedYear } = req.body;
  let studentImageUrl = null;

  try {
    const placement = await Placement.findById(req.params.id);

    if (placement) {
      placement.studentName = studentName || placement.studentName;
      placement.position = position || placement.position;
      placement.companyName = companyName || placement.companyName;
      placement.description = description || placement.description;
      placement.studentCollege = studentCollege || placement.studentCollege;
      placement.placedYear = placedYear || placement.placedYear;

      if (req.file) {
        // Upload new image to Cloudinary
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'placed_images',
          });
          studentImageUrl = result.secure_url;

          // Delete the old image from Cloudinary
          if (placement.studentImage) {
            const publicId = placement.studentImage.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`placed_images/${publicId}`);
          }
        } catch (error) {
          return res.status(500).json({ message: 'Image upload failed', error: error.message });
        }

        placement.studentImage = studentImageUrl;
      }

      const updatedPlacement = await placement.save();
      res.json(updatedPlacement);
    } else {
      res.status(404).json({ message: 'Placement not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a placement
// @route   DELETE /api/placements/:id
// @access  Public
const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (placement) {
      // Delete the image from Cloudinary
      if (placement.studentImage) {
        const publicId = placement.studentImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`placed_images/${publicId}`);
      }

      await Placement.deleteOne({ _id: req.params.id });
      res.json({ message: 'Placement removed' });
    } else {
      res.status(404).json({ message: 'Placement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total count of placements
// @route   GET /api/placements/count
// @access  Public
const getPlacementsCount = async (req, res) => {
  try {
    const count = await Placement.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement,
  deletePlacement,
  getPlacementsCount,
};
