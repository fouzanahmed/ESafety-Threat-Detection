const logger = require('../utils/logger');

class DeepfakeDetectionService {
  constructor() {
    // Deepfake detection indicators
    this.visualIndicators = [
      'unnatural eye movement',
      'inconsistent lighting',
      'blurred edges around face',
      'mismatched skin tone',
      'irregular facial features',
      'lip sync issues',
      'unnatural blinking patterns'
    ];

    this.contextualIndicators = [
      'appears to be generated',
      'synthetic voice',
      'manipulated video',
      'fake celebrity',
      'altered appearance',
      'face swap'
    ];
  }

  /**
   * Analyze image for deepfake indicators
   */
  async analyzeImage(imageBuffer, aiAnalysis) {
    try {
      const indicators = [];
      let confidence = 0;

      // Check AI analysis for deepfake indicators
      if (aiAnalysis && aiAnalysis.explanation) {
        const explanation = aiAnalysis.explanation.toLowerCase();

        // Check for visual anomalies
        this.visualIndicators.forEach(indicator => {
          if (explanation.includes(indicator.toLowerCase())) {
            indicators.push({
              type: 'visual',
              indicator: indicator,
              severity: 'high'
            });
            confidence += 15;
          }
        });

        // Check for contextual clues
        this.contextualIndicators.forEach(indicator => {
          if (explanation.includes(indicator.toLowerCase())) {
            indicators.push({
              type: 'contextual',
              indicator: indicator,
              severity: 'medium'
            });
            confidence += 10;
          }
        });
      }

      // Additional heuristics
      const result = {
        isLikelyDeepfake: confidence > 30,
        confidence: Math.min(confidence, 100),
        indicators: indicators,
        riskLevel: this.calculateRiskLevel(confidence),
        recommendations: this.getRecommendations(confidence)
      };

      logger.info('Deepfake analysis complete:', { confidence: result.confidence });

      return result;
    } catch (error) {
      logger.error('Deepfake detection error:', error);
      return {
        isLikelyDeepfake: false,
        confidence: 0,
        indicators: [],
        riskLevel: 'unknown',
        recommendations: []
      };
    }
  }

  /**
   * Enhanced AI prompt for deepfake detection
   */
  getDeepfakePrompt() {
    return `Analyze this image for signs of deepfake or AI-generated content.

Look for:
1. FACIAL ANOMALIES:
   - Unnatural skin texture or lighting
   - Inconsistent shadows or reflections
   - Blurred or warped edges around face
   - Mismatched facial features
   - Unusual eye appearance or blinking

2. TECHNICAL ARTIFACTS:
   - Compression artifacts around face
   - Color inconsistencies
   - Unnatural hair or teeth
   - Background inconsistencies
   - Digital manipulation signs

3. CONTEXTUAL CLUES:
   - Impossible scenarios
   - Celebrity face swaps
   - Age/gender manipulation
   - Synthetic generation patterns

4. METADATA CONCERNS:
   - Image quality inconsistencies
   - Resolution mismatches
   - Unusual aspect ratios

Rate deepfake likelihood (0-100) and explain specific indicators found.`;
  }

  calculateRiskLevel(confidence) {
    if (confidence < 30) return 'low';
    if (confidence < 60) return 'moderate';
    if (confidence < 80) return 'high';
    return 'critical';
  }

  getRecommendations(confidence) {
    const recommendations = [];

    if (confidence > 60) {
      recommendations.push('This image shows strong indicators of manipulation');
      recommendations.push('Verify source before sharing or believing content');
      recommendations.push('Use reverse image search to find original');
      recommendations.push('Check for other versions of this image online');
    } else if (confidence > 30) {
      recommendations.push('Some signs of potential manipulation detected');
      recommendations.push('Exercise caution with this content');
      recommendations.push('Verify through multiple sources');
    } else {
      recommendations.push('No strong deepfake indicators detected');
      recommendations.push('Image appears authentic');
    }

    return recommendations;
  }
}

module.exports = new DeepfakeDetectionService();
