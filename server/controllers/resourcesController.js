const resources = require('../data/resources');
const logger = require('../utils/logger');

class ResourcesController {
  getResourcesByCategory(req, res) {
    try {
      const { category } = req.params;

      const categoryResources = resources[category];

      if (!categoryResources) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({
        category,
        resources: categoryResources
      });
    } catch (error) {
      logger.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  }

  getAllResources(req, res) {
    try {
      res.json(resources);
    } catch (error) {
      logger.error('Error fetching all resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  }

  submitFeedback(req, res) {
    try {
      const { analysisId, feedback, helpful } = req.body;

      // Log feedback for future improvements
      logger.info('Feedback received:', { analysisId, feedback, helpful });

      // In production, store this in database
      res.json({
        message: 'Thank you for your feedback',
        received: true
      });
    } catch (error) {
      logger.error('Error submitting feedback:', error);
      res.status(500).json({ error: 'Failed to submit feedback' });
    }
  }
}

module.exports = new ResourcesController();
