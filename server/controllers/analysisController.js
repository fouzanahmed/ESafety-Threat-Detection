const aiService = require('../services/aiService');
const nlpService = require('../services/nlpService');
const imageService = require('../services/imageService');
const urlService = require('../services/urlService');
const deepfakeService = require('../services/deepfakeDetectionService');
const groomingService = require('../services/groomingDetectionService');
const cyberbullyingService = require('../services/cyberbullyingDetectionService');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class AnalysisController {
  async analyzeText(req, res, next) {
    try {
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      if (text.length > 50000) {
        return res.status(400).json({ error: 'Text is too long. Maximum 50,000 characters.' });
      }

      logger.info(`Analyzing text content (${text.length} chars)`);

      // Perform NLP preprocessing
      const preprocessed = nlpService.preprocessText(text);

      // Get AI analysis
      const aiAnalysis = await aiService.analyzeContent(text, 'text');

      // Combine with rule-based analysis
      const ruleBasedAnalysis = nlpService.analyzePatterns(preprocessed);

      // Generate final score and analysis
      const result = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        contentType: 'text',
        threatScore: calculateThreatScore(aiAnalysis, ruleBasedAnalysis),
        category: determineCategory(aiAnalysis, ruleBasedAnalysis),
        explanation: aiAnalysis.explanation,
        detectedPatterns: ruleBasedAnalysis.patterns,
        confidence: aiAnalysis.confidence,
        recommendations: generateRecommendations(aiAnalysis.category, aiAnalysis.threatScore)
      };

      logger.info(`Analysis complete - Score: ${result.threatScore}, Category: ${result.category}`);

      res.json(result);
    } catch (error) {
      logger.error('Error analyzing text:', error);
      next(error);
    }
  }

  async analyzeImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      logger.info(`Analyzing image (${req.file.size} bytes, ${req.file.mimetype})`);

      // Process image
      const processedImage = await imageService.processImage(req.file.buffer);

      // Extract text from image (OCR)
      const extractedText = await imageService.extractText(processedImage);

      // Analyze image content with AI
      const imageAnalysis = await aiService.analyzeImage(processedImage);

      // Analyze extracted text if present
      let textAnalysis = null;
      if (extractedText && extractedText.length > 10) {
        textAnalysis = await aiService.analyzeContent(extractedText, 'text');
      }

      // Combine analyses
      const result = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        contentType: 'image',
        threatScore: combineScores(imageAnalysis, textAnalysis),
        category: determineCategory(imageAnalysis, textAnalysis),
        explanation: generateExplanation(imageAnalysis, textAnalysis),
        hasText: extractedText && extractedText.length > 10,
        extractedText: extractedText,
        confidence: calculateConfidence(imageAnalysis, textAnalysis),
        recommendations: generateRecommendations(
          determineCategory(imageAnalysis, textAnalysis),
          combineScores(imageAnalysis, textAnalysis)
        )
      };

      logger.info(`Image analysis complete - Score: ${result.threatScore}, Category: ${result.category}`);

      res.json(result);
    } catch (error) {
      logger.error('Error analyzing image:', error);
      next(error);
    }
  }

  async analyzeUrl(req, res, next) {
    try {
      const { url } = req.body;

      if (!url || !isValidUrl(url)) {
        return res.status(400).json({ error: 'Valid URL is required' });
      }

      logger.info(`Analyzing URL: ${url}`);

      // Fetch and extract content from URL
      const urlContent = await urlService.extractContent(url);

      // Determine content type
      const contentType = urlService.detectContentType(url);

      // Analyze based on content type
      let analysis;
      if (contentType === 'video') {
        analysis = await analyzeVideoContent(urlContent);
      } else if (contentType === 'social') {
        analysis = await analyzeSocialContent(urlContent);
      } else {
        analysis = await analyzeWebContent(urlContent);
      }

      const result = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        contentType: contentType,
        url: url,
        threatScore: analysis.threatScore,
        category: analysis.category,
        explanation: analysis.explanation,
        metadata: urlContent.metadata,
        confidence: analysis.confidence,
        recommendations: generateRecommendations(analysis.category, analysis.threatScore)
      };

      logger.info(`URL analysis complete - Score: ${result.threatScore}, Category: ${result.category}`);

      res.json(result);
    } catch (error) {
      logger.error('Error analyzing URL:', error);
      next(error);
    }
  }

  async analyzeBatch(req, res, next) {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items array is required' });
      }

      if (items.length > 10) {
        return res.status(400).json({ error: 'Maximum 10 items per batch' });
      }

      logger.info(`Batch analysis requested for ${items.length} items`);

      const results = await Promise.all(
        items.map(async (item, index) => {
          try {
            if (item.type === 'text') {
              return await this.analyzeTextInternal(item.content);
            } else if (item.type === 'url') {
              return await this.analyzeUrlInternal(item.content);
            }
          } catch (error) {
            logger.error(`Error analyzing batch item ${index}:`, error);
            return { error: error.message, index };
          }
        })
      );

      res.json({ results, total: items.length });
    } catch (error) {
      logger.error('Error in batch analysis:', error);
      next(error);
    }
  }

  // Internal methods for batch processing
  async analyzeTextInternal(text) {
    const preprocessed = nlpService.preprocessText(text);
    const aiAnalysis = await aiService.analyzeContent(text, 'text');
    const ruleBasedAnalysis = nlpService.analyzePatterns(preprocessed);

    return {
      threatScore: calculateThreatScore(aiAnalysis, ruleBasedAnalysis),
      category: determineCategory(aiAnalysis, ruleBasedAnalysis),
      explanation: aiAnalysis.explanation
    };
  }

  async analyzeUrlInternal(url) {
    const urlContent = await urlService.extractContent(url);
    const analysis = await aiService.analyzeContent(urlContent.text, 'text');
    return {
      url,
      threatScore: analysis.threatScore,
      category: analysis.category,
      explanation: analysis.explanation
    };
  }

  // Multi-image analysis
  async analyzeImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'At least one image file is required' });
      }

      logger.info(`Analyzing ${req.files.length} images`);

      const results = await Promise.all(
        req.files.map(async (file, index) => {
          try {
            const processedImage = await imageService.processImage(file.buffer);
            const extractedText = await imageService.extractText(processedImage);
            const imageAnalysis = await aiService.analyzeImage(processedImage);

            let textAnalysis = null;
            if (extractedText && extractedText.length > 10) {
              textAnalysis = await aiService.analyzeContent(extractedText, 'text');
            }

            // Check for cyberbullying in images
            const bullyingAnalysis = cyberbullyingService.analyzeImage(imageAnalysis, {
              isPublic: true
            });

            return {
              imageIndex: index + 1,
              threatScore: combineScores(imageAnalysis, textAnalysis),
              category: determineCategory(imageAnalysis, textAnalysis),
              explanation: generateExplanation(imageAnalysis, textAnalysis),
              hasText: extractedText && extractedText.length > 10,
              extractedText: extractedText,
              cyberbullying: bullyingAnalysis
            };
          } catch (error) {
            logger.error(`Error analyzing image ${index + 1}:`, error);
            return { imageIndex: index + 1, error: error.message };
          }
        })
      );

      // Calculate overall analysis
      const validResults = results.filter(r => !r.error);
      const overallScore = validResults.length > 0
        ? Math.round(validResults.reduce((sum, r) => sum + r.threatScore, 0) / validResults.length)
        : 0;

      const result = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        contentType: 'multi-image',
        totalImages: req.files.length,
        overallThreatScore: overallScore,
        individualResults: results,
        recommendations: generateRecommendations('concerning', overallScore)
      };

      res.json(result);
    } catch (error) {
      logger.error('Error analyzing images:', error);
      next(error);
    }
  }

  // Specialized deepfake detection
  async analyzeDeepfake(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      logger.info('Analyzing image for deepfake indicators');

      const processedImage = await imageService.processImage(req.file.buffer);

      // Get AI analysis with deepfake-specific prompt
      const aiAnalysis = await aiService.analyzeImage(processedImage, deepfakeService.getDeepfakePrompt());

      // Get deepfake-specific analysis
      const deepfakeAnalysis = await deepfakeService.analyzeImage(processedImage, aiAnalysis);

      const result = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        contentType: 'deepfake-analysis',
        isLikelyDeepfake: deepfakeAnalysis.isLikelyDeepfake,
        confidence: deepfakeAnalysis.confidence,
        riskLevel: deepfakeAnalysis.riskLevel,
        indicators: deepfakeAnalysis.indicators,
        aiAnalysis: aiAnalysis.explanation,
        recommendations: deepfakeAnalysis.recommendations
      };

      res.json(result);
    } catch (error) {
      logger.error('Error in deepfake analysis:', error);
      next(error);
    }
  }

  // Grooming detection
  async analyzeGrooming(req, res, next) {
    try {
      const { text, messages } = req.body;

      if (!text && (!messages || messages.length === 0)) {
        return res.status(400).json({ error: 'Text or messages array is required' });
      }

      logger.info('Analyzing content for grooming patterns');

      let groomingAnalysis;
      let conversationAnalysis = null;

      if (messages && messages.length > 0) {
        // Analyze conversation thread
        conversationAnalysis = groomingService.analyzeConversation(messages);

        // Also analyze combined text
        const combinedText = messages.map(m => m.text || m).join('\n');
        groomingAnalysis = groomingService.analyzeText(combinedText);
      } else {
        groomingAnalysis = groomingService.analyzeText(text);
      }

      const result = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        contentType: 'grooming-analysis',
        isGrooming: groomingAnalysis.isGrooming,
        threatScore: groomingAnalysis.threatScore,
        riskLevel: groomingAnalysis.riskLevel,
        detectedPatterns: groomingAnalysis.detectedPatterns,
        conversationAnalysis: conversationAnalysis,
        recommendations: groomingAnalysis.recommendations
      };

      res.json(result);
    } catch (error) {
      logger.error('Error in grooming analysis:', error);
      next(error);
    }
  }

  // Cyberbullying detection
  async analyzeCyberbullying(req, res, next) {
    try {
      const { text, messages, metadata } = req.body;

      if (!text && (!messages || messages.length === 0)) {
        return res.status(400).json({ error: 'Text or messages array is required' });
      }

      logger.info('Analyzing content for cyberbullying');

      let bullyingAnalysis;
      let threadAnalysis = null;

      if (messages && messages.length > 0) {
        // Analyze thread
        threadAnalysis = cyberbullyingService.analyzeThread(messages, metadata?.userId);

        // Also analyze combined text
        const combinedText = messages.map(m => m.text || m).join('\n');
        bullyingAnalysis = cyberbullyingService.analyzeMessage(combinedText, metadata);
      } else {
        bullyingAnalysis = cyberbullyingService.analyzeMessage(text, metadata);
      }

      const result = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        contentType: 'cyberbullying-analysis',
        isCyberbullying: bullyingAnalysis.isCyberbullying,
        threatScore: bullyingAnalysis.threatScore,
        riskLevel: bullyingAnalysis.riskLevel,
        bullyingType: bullyingAnalysis.bullyingType,
        detectedPatterns: bullyingAnalysis.detectedPatterns,
        threadAnalysis: threadAnalysis,
        recommendations: bullyingAnalysis.recommendations
      };

      res.json(result);
    } catch (error) {
      logger.error('Error in cyberbullying analysis:', error);
      next(error);
    }
  }

  // Conversation thread analysis
  async analyzeConversation(req, res, next) {
    try {
      const { messages, analysisType } = req.body;

      if (!messages || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      logger.info(`Analyzing conversation with ${messages.length} messages`);

      // Run multiple analyses
      const groomingAnalysis = groomingService.analyzeConversation(messages);
      const bullyingAnalysis = cyberbullyingService.analyzeThread(messages);

      // AI analysis of overall conversation
      const conversationText = messages.map(m => m.text || m).join('\n\n');
      const aiAnalysis = await aiService.analyzeContent(conversationText, 'conversation');

      // Determine overall threat
      const maxThreatScore = Math.max(
        groomingAnalysis.progressionScore,
        bullyingAnalysis.overallThreatScore,
        aiAnalysis.threatScore
      );

      const result = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        contentType: 'conversation-analysis',
        messageCount: messages.length,
        overallThreatScore: maxThreatScore,
        grooming: {
          detected: groomingAnalysis.isSystematicGrooming,
          phases: groomingAnalysis.phases,
          progressionScore: groomingAnalysis.progressionScore,
          urgency: groomingAnalysis.urgency
        },
        cyberbullying: {
          detected: bullyingAnalysis.totalIncidents > 0,
          incidentCount: bullyingAnalysis.totalIncidents,
          isPersistent: bullyingAnalysis.isPersistent,
          isCoordinated: bullyingAnalysis.isCoordinated,
          pattern: bullyingAnalysis.pattern
        },
        aiAnalysis: {
          category: aiAnalysis.category,
          explanation: aiAnalysis.explanation,
          confidence: aiAnalysis.confidence
        },
        recommendations: this.generateConversationRecommendations(groomingAnalysis, bullyingAnalysis, maxThreatScore)
      };

      res.json(result);
    } catch (error) {
      logger.error('Error in conversation analysis:', error);
      next(error);
    }
  }

  generateConversationRecommendations(groomingAnalysis, bullyingAnalysis, threatScore) {
    const recommendations = [];

    if (groomingAnalysis.isSystematicGrooming) {
      recommendations.push('🚨 GROOMING DETECTED: Contact authorities immediately if minor involved');
      recommendations.push('Report to NCMEC CyberTipline: CyberTipline.org');
    }

    if (bullyingAnalysis.isCoordinated) {
      recommendations.push('⚠️ COORDINATED ATTACK: Document all evidence and report');
    }

    if (threatScore > 70) {
      recommendations.push('HIGH RISK CONVERSATION: Take immediate protective action');
      recommendations.push('Save all messages with timestamps');
      recommendations.push('Block involved parties');
      recommendations.push('Report to platform and authorities');
    }

    return recommendations;
  }
}
function calculateThreatScore(aiAnalysis, ruleBasedAnalysis) {
  const aiScore = aiAnalysis?.threatScore || 0;
  const ruleScore = ruleBasedAnalysis?.threatScore || 0;

  // Weighted average: 70% AI, 30% rule-based
  return Math.round(aiScore * 0.7 + ruleScore * 0.3);
}

function combineScores(analysis1, analysis2) {
  if (!analysis2) return analysis1?.threatScore || 0;
  if (!analysis1) return analysis2?.threatScore || 0;
  return Math.max(analysis1.threatScore, analysis2.threatScore);
}

function determineCategory(analysis1, analysis2) {
  const categories = ['safe', 'concerning', 'incel', 'mgtow', 'pua', 'grooming', 'extremist'];

  const cat1 = analysis1?.category || 'safe';
  const cat2 = analysis2?.category || 'safe';

  // Return the more severe category
  const index1 = categories.indexOf(cat1);
  const index2 = categories.indexOf(cat2);

  return index1 > index2 ? cat1 : cat2;
}

function generateExplanation(imageAnalysis, textAnalysis) {
  const parts = [];

  if (imageAnalysis?.explanation) {
    parts.push(`Image: ${imageAnalysis.explanation}`);
  }

  if (textAnalysis?.explanation) {
    parts.push(`Text: ${textAnalysis.explanation}`);
  }

  return parts.join(' | ');
}

function calculateConfidence(analysis1, analysis2) {
  if (!analysis2) return analysis1?.confidence || 0.5;
  if (!analysis1) return analysis2?.confidence || 0.5;
  return (analysis1.confidence + analysis2.confidence) / 2;
}

function generateRecommendations(category, score) {
  const recommendations = [];

  if (score >= 70) {
    recommendations.push('Consider reporting this content to the platform');
    recommendations.push('Document the content for your records');
  }

  if (category === 'grooming') {
    recommendations.push('If this involves a minor, contact local authorities immediately');
    recommendations.push('Visit NCMEC.org for resources');
  }

  if (category === 'extremist') {
    recommendations.push('Report to platform moderators');
    recommendations.push('Consider reporting to relevant authorities');
  }

  if (['incel', 'mgtow', 'pua'].includes(category)) {
    recommendations.push('Be cautious about engaging with this content');
    recommendations.push('Seek support resources if this content is affecting you');
  }

  if (score < 30) {
    recommendations.push('This content appears safe');
  }

  return recommendations;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

async function analyzeVideoContent(content) {
  const analysis = await aiService.analyzeContent(
    `${content.title}\n${content.description}\n${content.text}`,
    'video'
  );
  return analysis;
}

async function analyzeSocialContent(content) {
  const analysis = await aiService.analyzeContent(
    `${content.text}\n${content.comments?.join('\n') || ''}`,
    'social'
  );
  return analysis;
}

async function analyzeWebContent(content) {
  const analysis = await aiService.analyzeContent(content.text, 'web');
  return analysis;
}
module.exports = new AnalysisController();
