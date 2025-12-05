const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');

// Get resources by category
router.get('/:category', resourcesController.getResourcesByCategory);

// Get all resources
router.get('/', resourcesController.getAllResources);

// Report feedback (optional)
router.post('/feedback', resourcesController.submitFeedback);

module.exports = router;
