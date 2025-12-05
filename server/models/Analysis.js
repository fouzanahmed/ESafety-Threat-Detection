const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  contentType: {
    type: String,
    enum: ['text', 'image', 'video', 'social', 'web'],
    required: true
  },
  threatScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    enum: ['safe', 'concerning', 'incel', 'mgtow', 'pua', 'grooming', 'extremist'],
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  metadata: {
    hasText: Boolean,
    extractedText: String,
    url: String,
    detectedPatterns: [{
      category: String,
      pattern: String,
      count: Number
    }]
  },
  ipAddress: {
    type: String,
    // Hashed for privacy
    select: false
  },
  userAgent: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

// Indexes for analytics
analysisSchema.index({ category: 1, createdAt: -1 });
analysisSchema.index({ threatScore: -1 });
analysisSchema.index({ contentType: 1, createdAt: -1 });

// Virtual for risk level
analysisSchema.virtual('riskLevel').get(function() {
  if (this.threatScore < 30) return 'low';
  if (this.threatScore < 60) return 'moderate';
  if (this.threatScore < 80) return 'high';
  return 'critical';
});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
