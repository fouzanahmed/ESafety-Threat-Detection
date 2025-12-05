const logger = require('../utils/logger');

class GroomingDetectionService {
  constructor() {
    // Enhanced grooming patterns
    this.groomingPatterns = {
      // Trust building
      trustBuilding: [
        'you can trust me',
        'i understand you',
        'you\'re so mature',
        'you\'re different',
        'special connection',
        'no one else gets you',
        'i\'m your friend',
        'you can tell me anything'
      ],

      // Secrecy
      secrecy: [
        'keep this secret',
        'don\'t tell anyone',
        'between us',
        'our secret',
        'your parents won\'t understand',
        'they wouldn\'t get it',
        'delete this',
        'use private browser'
      ],

      // Isolation
      isolation: [
        'your friends don\'t understand',
        'your family is controlling',
        'only i care about you',
        'they\'re jealous',
        'you don\'t need them',
        'we should talk privately',
        'leave your friends'
      ],

      // Desensitization
      desensitization: [
        'age is just a number',
        'you\'re mature for your age',
        'age doesn\'t matter',
        'you act older',
        'love has no age',
        'you\'re not like other kids',
        'you\'re basically an adult'
      ],

      // Solicitation
      solicitation: [
        'send me a picture',
        'show me yourself',
        'turn on camera',
        'what are you wearing',
        'send nudes',
        'private photo',
        'just between us',
        'prove you trust me'
      ],

      // Meeting attempts
      meetingAttempts: [
        'let\'s meet up',
        'meet in person',
        'come over',
        'i\'ll pick you up',
        'don\'t tell your parents',
        'meet me alone',
        'secret meeting',
        'run away with me'
      ],

      // Gift giving
      giftGiving: [
        'i bought you',
        'special gift',
        'surprise for you',
        'sent you money',
        'bought you credit',
        'paid for',
        'i\'ll buy you'
      ],

      // Emotional manipulation
      emotionalManipulation: [
        'if you loved me',
        'prove your love',
        'you owe me',
        'after all i did',
        'you\'re hurting me',
        'i\'ll be sad',
        'i\'ll hurt myself',
        'you\'re ungrateful'
      ]
    };
  }

  /**
   * Analyze text for grooming patterns
   */
  analyzeText(text) {
    const lowerText = text.toLowerCase();
    const detectedPatterns = {};
    let totalScore = 0;

    Object.keys(this.groomingPatterns).forEach(category => {
      const patterns = this.groomingPatterns[category];
      const matches = [];

      patterns.forEach(pattern => {
        if (lowerText.includes(pattern.toLowerCase())) {
          matches.push(pattern);
        }
      });

      if (matches.length > 0) {
        detectedPatterns[category] = {
          matches: matches,
          count: matches.length,
          severity: this.getCategorySeverity(category)
        };

        // Weight by severity
        const severityWeight = this.getCategorySeverity(category) === 'critical' ? 15 :
                               this.getCategorySeverity(category) === 'high' ? 12 : 8;
        totalScore += matches.length * severityWeight;
      }
    });

    return {
      isGrooming: totalScore > 20,
      threatScore: Math.min(totalScore, 100),
      detectedPatterns: detectedPatterns,
      riskLevel: this.calculateRiskLevel(totalScore),
      recommendations: this.getRecommendations(totalScore, detectedPatterns)
    };
  }

  /**
   * Analyze conversation thread for grooming progression
   */
  analyzeConversation(messages) {
    let progressionScore = 0;
    const phases = {
      targeting: false,
      trustBuilding: false,
      isolation: false,
      desensitization: false,
      exploitation: false
    };

    messages.forEach(msg => {
      const analysis = this.analyzeText(msg.text || msg);

      // Check for grooming phases
      if (analysis.detectedPatterns.trustBuilding) phases.trustBuilding = true;
      if (analysis.detectedPatterns.isolation) phases.isolation = true;
      if (analysis.detectedPatterns.desensitization) phases.desensitization = true;
      if (analysis.detectedPatterns.solicitation || analysis.detectedPatterns.meetingAttempts) {
        phases.exploitation = true;
      }
    });

    // Calculate progression
    const activePhases = Object.values(phases).filter(v => v).length;
    progressionScore = activePhases * 20;

    return {
      phases: phases,
      progressionScore: progressionScore,
      isSystematicGrooming: activePhases >= 3,
      urgency: activePhases >= 3 ? 'immediate' : 'high'
    };
  }

  getCategorySeverity(category) {
    const criticalCategories = ['solicitation', 'meetingAttempts', 'desensitization'];
    const highCategories = ['secrecy', 'isolation', 'emotionalManipulation'];

    if (criticalCategories.includes(category)) return 'critical';
    if (highCategories.includes(category)) return 'high';
    return 'medium';
  }

  calculateRiskLevel(score) {
    if (score < 20) return 'low';
    if (score < 40) return 'moderate';
    if (score < 60) return 'high';
    return 'critical';
  }

  getRecommendations(score, patterns) {
    const recommendations = [];

    if (score > 60) {
      recommendations.push('🚨 URGENT: Strong indicators of grooming behavior detected');
      recommendations.push('Contact law enforcement immediately if a minor is involved');
      recommendations.push('Report to NCMEC CyberTipline: CyberTipline.org');
      recommendations.push('Document all communications without engaging further');
      recommendations.push('Block the person immediately');
    } else if (score > 40) {
      recommendations.push('⚠️ HIGH RISK: Multiple grooming indicators present');
      recommendations.push('If involving a minor, contact authorities');
      recommendations.push('Document the conversation');
      recommendations.push('Consider reporting to platform moderators');
      recommendations.push('Seek guidance from child safety organizations');
    } else if (score > 20) {
      recommendations.push('⚠️ MODERATE CONCERN: Some concerning patterns detected');
      recommendations.push('Monitor the situation closely');
      recommendations.push('Discuss with trusted adults if involving minors');
      recommendations.push('Set clear boundaries');
    } else {
      recommendations.push('No strong grooming patterns detected');
      recommendations.push('Continue monitoring conversations for safety');
    }

    // Add specific category recommendations
    if (patterns.solicitation) {
      recommendations.push('Never send intimate photos to strangers or online contacts');
    }
    if (patterns.meetingAttempts) {
      recommendations.push('Never meet someone from online alone, especially if they request secrecy');
    }
    if (patterns.secrecy) {
      recommendations.push('Secrecy requests are a major red flag');
    }

    return recommendations;
  }
}

module.exports = new GroomingDetectionService();
