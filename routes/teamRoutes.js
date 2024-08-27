const express = require('express');
const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMemberCount,
} = require('../controllers/teamMemberController');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getTeamMembers)
  .post(upload.single('image'), createTeamMember);

router.route('/count')
  .get(getTeamMemberCount);

router.route('/:id')
  .get(getTeamMemberById)
  .put(upload.single('image'), updateTeamMember)
  .delete(deleteTeamMember);

module.exports = router;
