const express = require('express');
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyCount,
} = require('../controllers/companyController');

const router = express.Router();

router.route('/')
  .get(getCompanies)
  .post(createCompany);

router.route('/count')
  .get(getCompanyCount);

router.route('/:id')
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

module.exports = router;
