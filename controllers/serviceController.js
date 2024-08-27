const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Service = require('../models/service'); // Adjust the path according to your project structure

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});

// Configure multer for Cloudinary upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'service_images', // Cloudinary folder name
    allowedFormats: ['jpeg', 'jpg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage });

// Create a new service
exports.createService = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: 'error', message: err.message });
    }

    try {
      const { serviceTitle, description } = req.body;
      const image = req.file ? req.file.path : ''; // Cloudinary URL
      const newService = new Service({ serviceTitle, image, description });
      await newService.save();
      res.status(201).json({ status: 'success', message: 'Service created successfully', data: newService });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ status: 'success', data: services });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get a service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ status: 'error', message: 'Service not found' });
    }
    res.status(200).json({ status: 'success', data: service });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update a service by ID
exports.updateService = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: 'error', message: err.message });
    }

    const { serviceTitle, description } = req.body;
    const newImage = req.file ? req.file.path : '';

    try {
      const service = await Service.findById(req.params.id);

      if (service) {
        // Delete the old image from Cloudinary if there's a new image
        if (newImage && service.image) {
          const publicId = service.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`service_images/${publicId}`);
        }

        service.serviceTitle = serviceTitle || service.serviceTitle;
        service.description = description || service.description;
        if (newImage) {
          service.image = newImage;
        }

        const updatedService = await service.save();
        res.status(200).json({ status: 'success', data: updatedService });
      } else {
        res.status(404).json({ status: 'error', message: 'Service not found' });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
};

// Delete a service by ID
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      // Delete the image from Cloudinary
      if (service.image) {
        const publicId = service.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`service_images/${publicId}`);
      }

      await Service.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: 'success', message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ status: 'error', message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
