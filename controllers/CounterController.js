const Counter = require('../models/counterModel');

// Get all counters
exports.getAllCounters = async (req, res) => {
  try {
    const counters = await Counter.find(); // Fetch all counters
    res.status(200).json({
      message: 'Counters retrieved successfully',
      data: counters
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving counters',
      error: error.message
    });
  }
};


// Create a new counter
// Create a new counter with data
exports.createCounter = async (req, res) => {
  try {
    // Extract data from request body
    const { count1, count2, count3, count4 } = req.body;

    // Create a new counter with the provided data
    const counter = new Counter({
      count1: count1 || 0, // Set default value if not provided
      count2: count2 || 0,
      count3: count3 || 0,
      count4: count4 || 0
    });

    await counter.save();
    res.status(201).json({
      message: 'Counter created successfully',
      data: counter
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating counter',
      error: error.message
    });
  }
};


// Get a counter by ID
exports.getCounterById = async (req, res) => {
  try {
    const counter = await Counter.findById(req.params.id);
    if (!counter) {
      return res.status(404).json({ message: 'Counter not found' });
    }
    res.status(200).json({
      message: 'Counter retrieved successfully',
      data: counter
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving counter',
      error: error.message
    });
  }
};

// Update a counter by ID
exports.updateCounter = async (req, res) => {
  try {
    const counter = await Counter.findById(req.params.id);
    if (!counter) {
      return res.status(404).json({ message: 'Counter not found' });
    }

    // Update counts based on request body
    counter.count1 = req.body.count1 !== undefined ? req.body.count1 : counter.count1;
    counter.count2 = req.body.count2 !== undefined ? req.body.count2 : counter.count2;
    counter.count3 = req.body.count3 !== undefined ? req.body.count3 : counter.count3;
    counter.count4 = req.body.count4 !== undefined ? req.body.count4 : counter.count4;

    await counter.save();
    res.status(200).json({
      message: 'Counter updated successfully',
      data: counter
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating counter',
      error: error.message
    });
  }
};

// Delete a counter by ID
exports.deleteCounter = async (req, res) => {
  try {
    const counter = await Counter.findByIdAndDelete(req.params.id);
    if (!counter) {
      return res.status(404).json({ message: 'Counter not found' });
    }
    res.status(200).json({
      message: 'Counter deleted successfully',
      data: counter
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting counter',
      error: error.message
    });
  }
};
