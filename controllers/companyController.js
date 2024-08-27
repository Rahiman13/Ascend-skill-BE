const Company = require('../models/companyModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});


// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'company_images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

const upload = multer({ storage });

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new company
// @route   POST /api/companies
// @access  Public
const createCompany = async (req, res) => {
  upload.single('logo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, location, description, countOfPlacedStudents, industry } = req.body;
    const logo = req.file ? req.file.path : '';

    const company = new Company({
      name,
      logo,
      location,
      description,
      countOfPlacedStudents,
      industry,
    });

    try {
      const newCompany = await company.save();
      res.status(201).json(newCompany);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Public
const updateCompany = async (req, res) => {
  upload.single('logo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, location, description, countOfPlacedStudents, industry } = req.body;
    const logo = req.file ? req.file.path : '';

    try {
      const company = await Company.findById(req.params.id);

      if (company) {
        company.name = name || company.name;
        company.location = location || company.location;
        company.description = description || company.description;
        company.countOfPlacedStudents = countOfPlacedStudents || company.countOfPlacedStudents;
        company.industry = industry || company.industry;

        // Only update the logo if a new one is provided
        if (logo) {
          // Delete old logo from Cloudinary if it exists
          if (company.logo) {
            const publicId = company.logo.split('/').pop().split('.')[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(`company_images/${publicId}`);
          }
          company.logo = logo;
        }

        const updatedCompany = await company.save();
        res.json(updatedCompany);
      } else {
        res.status(404).json({ message: 'Company not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Public
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      // Delete logo from Cloudinary if it exists
      if (company.logo) {
        const publicId = company.logo.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(`company_images/${publicId}`);
      }

      await Company.deleteOne({ _id: req.params.id });
      res.json({ message: 'Company removed' });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total count of companies
// @route   GET /api/companies/count
// @access  Public
const getCompanyCount = async (req, res) => {
  try {
    const count = await Company.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyCount,
};
