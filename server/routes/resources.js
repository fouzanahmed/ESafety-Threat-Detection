const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const resourcesController = require('../controllers/resourcesController');

// Mirrors the Feedback model's 1000-character cap on the free-text field.
const MAX_FEEDBACK_LENGTH = 1000;
const MAX_ANALYSIS_ID_LENGTH = 100;

// Rejects the request with the first validation error, using the same
// { error: message } shape as routes/analysis.js and the controllers.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

const feedbackValidation = [
  body('analysisId')
    .exists({ checkFalsy: true }).withMessage('analysisId is required')
    .bail()
    .isString().withMessage('analysisId must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('analysisId is required')
    .bail()
    .isLength({ max: MAX_ANALYSIS_ID_LENGTH })
    .withMessage(`analysisId must be at most ${MAX_ANALYSIS_ID_LENGTH} characters`),
  body('helpful')
    .optional({ values: 'null' })
    // A typeof check rather than isBoolean(): validator.js stringifies input,
    // so isBoolean() would also accept "true"/"false"/"1"/"0" strings.
    .custom((value) => typeof value === 'boolean').withMessage('helpful must be a boolean'),
  body('feedback')
    .optional({ values: 'null' })
    .isString().withMessage('feedback must be a string')
    .bail()
    .isLength({ max: MAX_FEEDBACK_LENGTH })
    .withMessage(`feedback must be at most ${MAX_FEEDBACK_LENGTH} characters`),
  validate
];

// Get resources by category
router.get('/:category', resourcesController.getResourcesByCategory);

// Get all resources
router.get('/', resourcesController.getAllResources);

// Report feedback (optional)
router.post('/feedback', feedbackValidation, resourcesController.submitFeedback);

module.exports = router;
