const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Route to create a new address
router.post('/addresses', addressController.createAddress);

// Route to get all addresses
router.get('/addresses', addressController.getAllAddresses);

// Route to get an address by ID
router.get('/addresses/:id', addressController.getAddressById);

// Route to update an address by ID
router.put('/addresses/:id', addressController.updateAddressById);

// Route to delete an address by ID
router.delete('/addresses/:id', addressController.deleteAddressById);

module.exports = router;
