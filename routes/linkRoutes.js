const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkcontroller'); // Adjust the path as needed

router.post('/links', linkController.createLink);
router.get('/links', linkController.getAllLinks);
router.get('/links/:id', linkController.getLinkById);
router.put('/links/:id', linkController.updateLinkById);
router.delete('/links/:id', linkController.deleteLinkById);

module.exports = router;
