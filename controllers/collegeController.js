const College = require('../models/collegeModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dmst4lbrx',
  api_key: '828194579658255',
  api_secret: '4hij7lz9E3GNXkFgGW6XnvJ1DFo',
});

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
const getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get college by ID
// @route   GET /api/colleges/:id
// @access  Public
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (college) {
      res.json(college);
    } else {
      res.status(404).json({ message: 'College not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new college
// @route   POST /api/colleges
// @access  Public
const createCollege = async (req, res) => {
  const { name, location, description } = req.body;

  try {
    // Upload the logo to Cloudinary if provided
    let logoUrl = null;
    if (req.file) {
      const logoUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'college_images',
      });
      logoUrl = logoUpload.secure_url;
      fs.unlinkSync(req.file.path); // Delete the file from the server after upload
    }

    const college = new College({
      name,
      logo: logoUrl,
      location,
      description,
    });

    const newCollege = await college.save();
    res.status(201).json(newCollege);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a college
// @route   PUT /api/colleges/:id
// @access  Public
const updateCollege = async (req, res) => {
  const { name, location, description } = req.body;

  try {
    const college = await College.findById(req.params.id);

    if (college) {
      college.name = name || college.name;
      college.location = location || college.location;
      college.description = description || college.description;

      // Update the logo if a new one is provided
      if (req.file) {
        // Delete the old logo from Cloudinary
        if (college.logo) {
          const public_id = college.logo.split('/').pop().split('.')[0]; // Extract the public_id
          await cloudinary.uploader.destroy(`review_images/${public_id}`);
        }

        // Upload the new logo to Cloudinary
        const logoUpload = await cloudinary.uploader.upload(req.file.path, {
          folder: 'review_images',
        });

        college.logo = logoUpload.secure_url;
        fs.unlinkSync(req.file.path); // Delete the file from the server after upload
      }

      const updatedCollege = await college.save();
      res.json(updatedCollege);
    } else {
      res.status(404).json({ message: 'College not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a college
// @route   DELETE /api/colleges/:id
// @access  Public
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (college) {
      // Delete the logo from Cloudinary if it exists
      if (college.logo) {
        const public_id = college.logo.split('/').pop().split('.')[0]; // Extract the public_id
        await cloudinary.uploader.destroy(`college_images/${public_id}`);
      }

      await College.deleteOne({ _id: req.params.id });
      res.json({ message: 'College removed' });
    } else {
      res.status(404).json({ message: 'College not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get college count
// @route   GET /api/colleges/count
// @access  Public
const getCollegeCount = async (req, res) => {
  try {
    const count = await College.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegeCount,
};
