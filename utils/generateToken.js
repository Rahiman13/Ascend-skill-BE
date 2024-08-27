// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Define your secret key
const secretKey = 'your-secret-key';

// Define the payload
const payload = {
    userId: '12345', // Replace with your user's ID
    username: 'john_doe', // Replace with your user's username
    email: 'john_doe@example.com' // Replace with your user's email
};

// Define the options (optional)
const options = {
    expiresIn: '1h' // Token will expire in 1 hour
};

// Generate the token
const token = jwt.sign(payload, secretKey, options);

console.log('Generated JWT:', token);
