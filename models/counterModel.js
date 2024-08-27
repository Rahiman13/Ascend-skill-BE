const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  count1: {
    type: Number,
    default: 0,
  },
  count2: {
    type: Number,
    default: 0,
  },
  count3: {
    type: Number,
    default: 0,
  },
  count4: {
    type: Number,
    default: 0,
  }
});

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
