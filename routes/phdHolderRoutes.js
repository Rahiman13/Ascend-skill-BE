const express = require('express');
const {
  getPhdHolders,
  getPhdHolderById,
  createPhdHolder,
  updatePhdHolder,
  deletePhdHolder,
  getPhdHolderCount,
} = require('../controllers/phdHolderController');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getPhdHolders)
  .post(upload.single('image'), createPhdHolder);

router.route('/count')
  .get(getPhdHolderCount);

router.route('/:id')
  .get(getPhdHolderById)
  .put(upload.single('image'), updatePhdHolder)
  .delete(deletePhdHolder);

module.exports = router;
