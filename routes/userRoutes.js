const express = require('express');
const { check } = require('express-validator');
const {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('collegeName', 'College name is required').not().isEmpty(),
    check('mobile', 'Mobile number is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authUser
);

router.route('/profile').get(protect, getUserProfile);
router.route('/').get(getUsers);
router.route('/:id')
  .get( getUserById)
  .put( updateUser)
  .delete( deleteUser);

module.exports = router;
