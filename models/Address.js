const mongoose = require('mongoose');

// Define the schema for the Address model
const AddressSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  email: {
    type: [String], // Array of strings to handle multiple emails
  },
  phone_number: {
    type: [String], // Array of strings to handle multiple phone numbers
  },
  instagram_link: {
    type: String,
  },
  facebook_link: {
    type: String,
  },
  linkedin_link: {
    type: String,
  },
  twitter_link: {
    type: String,
  },
  other_links: {
    type: Map, // Map type to store key-value pairs
    of: String, // Values will be of type string
  },
});

// Create the Address model
const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
