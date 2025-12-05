const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  analysisId: {
    type: String,
    required: true,
    index: true
  },
  helpful: {
    type: Boolean,
    required: true
  },
  feedback: {
    type: String,
    maxlength: 1000
  },
  category: {
    type: String
  },
  threatScore: {
    type: Number
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
