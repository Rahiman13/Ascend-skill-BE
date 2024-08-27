const express = require('express');
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getContactCount,
} = require('../controllers/contactController');

const router = express.Router();

router.route('/')
  .get(getContacts)
  .post(createContact);

router.route('/count')
  .get(getContactCount);
  
router.route('/:id')
  .get(getContactById)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
