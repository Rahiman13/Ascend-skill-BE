const Address = require('../models/Address');

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json({ status: 'success', message: 'Address created successfully', data: address });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json({ status: 'success', data: addresses });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ status: 'error', message: 'Address not found' });
    }
    res.status(200).json({ status: 'success', data: address });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update address by ID
exports.updateAddressById = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!address) {
      return res.status(404).json({ status: 'error', message: 'Address not found' });
    }
    res.status(200).json({ status: 'success', message: 'Address updated successfully', data: address });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Delete address by ID
exports.deleteAddressById = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) {
      return res.status(404).json({ status: 'error', message: 'Address not found' });
    }
    res.status(200).json({ status: 'success', message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
