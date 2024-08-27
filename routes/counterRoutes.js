const express = require('express');
const router = express.Router();
const CounterController = require('../controllers/CounterController');

// Route to create a new counter
router.get('/counters', CounterController.getAllCounters);
router.post('/counters', CounterController.createCounter);

// Route to get a counter by ID
router.get('/counters/:id', CounterController.getCounterById);

// Route to update a counter by ID
router.put('/counters/:id', CounterController.updateCounter);

// Route to delete a counter by ID
router.delete('/counters/:id', CounterController.deleteCounter);

module.exports = router;
