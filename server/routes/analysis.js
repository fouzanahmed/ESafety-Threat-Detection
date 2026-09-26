const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const analysisController = require('../controllers/analysisController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Rejects the request with the first validation error, keeping the
// existing { error: message } shape the controllers already use.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

// Shared "text or messages" requirement used by grooming/cyberbullying
function requireTextOrMessages(req) {
  const { text, messages } = req.body;
  const hasText = typeof text === 'string' && text.trim().length > 0;
  const hasMessages = Array.isArray(messages) && messages.length > 0;
  if (!hasText && !hasMessages) {
    throw new Error('Text or messages array is required');
  }
  return true;
}

const textValidation = [
  body('text')
    .exists({ checkFalsy: true }).withMessage('Text content is required')
    .bail()
    .isString().withMessage('Text content is required')
    .bail()
    .isLength({ max: 50000 }).withMessage('Text is too long. Maximum 50,000 characters.'),
  validate
];

const urlValidation = [
  body('url')
    .exists({ checkFalsy: true }).withMessage('Valid URL is required')
    .bail()
    .isString().withMessage('Valid URL is required')
    .bail()
    .isURL({ require_protocol: true }).withMessage('Valid URL is required'),
  validate
];

const batchValidation = [
  body('items')
    .exists().withMessage('Items array is required')
    .bail()
    .isArray({ min: 1 }).withMessage('Items array is required')
    .bail()
    .isArray({ max: 10 }).withMessage('Maximum 10 items per batch'),
  body('items.*.type')
    .exists({ checkFalsy: true }).withMessage('Each item must include a type of "text" or "url"')
    .bail()
    .isIn(['text', 'url']).withMessage('Each item type must be either "text" or "url"'),
  body('items.*.content')
    .exists({ checkFalsy: true }).withMessage('Each item must include non-empty content')
    .bail()
    .isString().withMessage('Each item content must be a string'),
  validate
];

const groomingValidation = [
  body().custom((value, { req }) => requireTextOrMessages(req)),
  body('text').optional().isString().withMessage('Text must be a string'),
  body('messages').optional().isArray({ min: 1 }).withMessage('Messages must be a non-empty array'),
  validate
];

const cyberbullyingValidation = [
  body().custom((value, { req }) => requireTextOrMessages(req)),
  body('text').optional().isString().withMessage('Text must be a string'),
  body('messages').optional().isArray({ min: 1 }).withMessage('Messages must be a non-empty array'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  validate
];

const conversationValidation = [
  body('messages')
    .exists().withMessage('Messages array is required')
    .bail()
    .isArray({ min: 1 }).withMessage('Messages array is required'),
  body('analysisType').optional().isString().withMessage('analysisType must be a string'),
  validate
];

// Text analysis
router.post('/text', textValidation, analysisController.analyzeText);

// Image analysis (single)
router.post('/image', upload.single('image'), analysisController.analyzeImage);

// Multi-image analysis (batch)
router.post('/images', upload.array('images', 10), analysisController.analyzeImages);

// URL analysis (for social media posts, videos, etc.)
router.post('/url', urlValidation, analysisController.analyzeUrl);

// Batch analysis
router.post('/batch', batchValidation, analysisController.analyzeBatch.bind(analysisController));

// Specialized analysis endpoints
router.post('/deepfake', upload.single('image'), analysisController.analyzeDeepfake);
router.post('/grooming', groomingValidation, analysisController.analyzeGrooming);
router.post('/cyberbullying', cyberbullyingValidation, analysisController.analyzeCyberbullying);
router.post('/conversation', conversationValidation, analysisController.analyzeConversation.bind(analysisController));

module.exports = router;
