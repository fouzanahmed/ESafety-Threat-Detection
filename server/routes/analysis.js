const express = require('express');
const router = express.Router();
const multer = require('multer');
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

// Text analysis
router.post('/text', analysisController.analyzeText);

// Image analysis (single)
router.post('/image', upload.single('image'), analysisController.analyzeImage);

// Multi-image analysis (batch)
router.post('/images', upload.array('images', 10), analysisController.analyzeImages);

// URL analysis (for social media posts, videos, etc.)
router.post('/url', analysisController.analyzeUrl);

// Batch analysis
router.post('/batch', analysisController.analyzeBatch);

// Specialized analysis endpoints
router.post('/deepfake', upload.single('image'), analysisController.analyzeDeepfake);
router.post('/grooming', analysisController.analyzeGrooming);
router.post('/cyberbullying', analysisController.analyzeCyberbullying);
router.post('/conversation', analysisController.analyzeConversation);

module.exports = router;
