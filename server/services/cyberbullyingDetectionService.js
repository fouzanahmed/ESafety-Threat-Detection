const logger = require('../utils/logger');

class CyberbullyingDetectionService {
  constructor() {
    // Cyberbullying and harassment patterns
    this.bullyingPatterns = {
      // Direct insults and name-calling
      insults: [
        'ugly', 'stupid', 'idiot', 'loser', 'freak', 'worthless',
        'fat', 'dumb', 'pathetic', 'disgusting', 'trash', 'garbage'
      ],

      // Threats
      threats: [
        'kill yourself', 'kys', 'die', 'hurt yourself', 'end it',
        'nobody likes you', 'everyone hates you', 'you should',
        'wish you were dead', 'better off dead'
      ],

      // Exclusion and isolation
      exclusion: [
        'nobody wants you', 'no one likes you', 'get lost',
        'go away', 'we don\'t want you', 'you\'re not invited',
        'leave us alone', 'you don\'t belong'
      ],

      // Humiliation
      humiliation: [
        'embarrassing', 'pathetic', 'ridiculous', 'joke',
        'laughingstock', 'everyone\'s laughing', 'so lame'
      ],

      // Sexual harassment
      sexualHarassment: [
        'send nudes', 'slut', 'whore', 'prude', 'tease',
        'sexy pics', 'show me', 'sexual comments about body'
      ],

      // Doxxing threats
      doxxing: [
        'leak your info', 'post your address', 'share your pics',
        'everyone will see', 'expose you', 'spread this',
        'your parents will find out', 'send to everyone'
      ],

      // Impersonation
      impersonation: [
        'pretending to be', 'fake account', 'posing as',
        'impersonating', 'using your name'
      ],

      // Cyberstalking
      stalking: [
        'watching you', 'following you', 'tracking you',
        'know where you live', 'found your', 'stalking your'
      ]
    };

    // Severity multipliers
    this.severityMultipliers = {
      repetition: 1.5,  // Repeated attacks
      public: 1.3,      // Public posts vs private
      coordinated: 2.0, // Group attacks
      persistent: 1.8   // Over time
    };
  }

  /**
   * Analyze single message for cyberbullying
   */
  analyzeMessage(text, metadata = {}) {
    const lowerText = text.toLowerCase();
    const detectedPatterns = {};
    let baseScore = 0;

    Object.keys(this.bullyingPatterns).forEach(category => {
      const patterns = this.bullyingPatterns[category];
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

        const severityWeight = this.getSeverityWeight(category);
        baseScore += matches.length * severityWeight;
      }
    });

    // Apply multipliers
    let finalScore = baseScore;
    if (metadata.isPublic) finalScore *= this.severityMultipliers.public;
    if (metadata.isRepeated) finalScore *= this.severityMultipliers.repetition;
    if (metadata.isCoordinated) finalScore *= this.severityMultipliers.coordinated;

    return {
      isCyberbullying: finalScore > 15,
      threatScore: Math.min(Math.round(finalScore), 100),
      detectedPatterns: detectedPatterns,
      riskLevel: this.calculateRiskLevel(finalScore),
      bullyingType: this.determineBullyingType(detectedPatterns),
      recommendations: this.getRecommendations(finalScore, detectedPatterns)
    };
  }

  /**
   * Analyze conversation thread for harassment patterns
   */
  analyzeThread(messages, userId = null) {
    const timeline = [];
    let persistenceScore = 0;
    const attackers = new Set();

    messages.forEach((msg, index) => {
      const analysis = this.analyzeMessage(msg.text || msg, {
        isPublic: msg.isPublic,
        isRepeated: index > 0
      });

      if (analysis.isCyberbullying) {
        timeline.push({
          index: index,
          timestamp: msg.timestamp,
          score: analysis.threatScore,
          type: analysis.bullyingType
        });

        if (msg.senderId) attackers.add(msg.senderId);
      }
    });

    // Calculate persistence
    if (timeline.length > 1) {
      persistenceScore = timeline.length * 10;
    }

    // Check for coordinated attack
    const isCoordinated = attackers.size > 2;

    return {
      totalIncidents: timeline.length,
      timeline: timeline,
      isPersistent: timeline.length >= 3,
      isCoordinated: isCoordinated,
      attackerCount: attackers.size,
      overallThreatScore: Math.min(persistenceScore + (isCoordinated ? 30 : 0), 100),
      pattern: this.identifyPattern(timeline),
      urgency: this.calculateUrgency(timeline, isCoordinated)
    };
  }

  /**
   * Analyze image for cyberbullying content
   */
  analyzeImage(imageAnalysis, metadata = {}) {
    const indicators = [];
    let score = 0;

    if (imageAnalysis && imageAnalysis.explanation) {
      const explanation = imageAnalysis.explanation.toLowerCase();

      // Check for humiliating content
      if (explanation.includes('humiliating') || explanation.includes('embarrassing')) {
        indicators.push('Potentially humiliating image');
        score += 20;
      }

      // Check for body shaming
      if (explanation.includes('body') && (explanation.includes('shame') || explanation.includes('mock'))) {
        indicators.push('Body shaming content');
        score += 25;
      }

      // Check for screenshot of conversation
      if (explanation.includes('screenshot') || explanation.includes('message')) {
        indicators.push('Potentially shared private conversation');
        score += 15;
      }

      // Check for altered/meme images
      if (explanation.includes('meme') || explanation.includes('altered') || explanation.includes('edited')) {
        indicators.push('Manipulated image potentially for mockery');
        score += 18;
      }
    }

    return {
      isBullyingContent: score > 20,
      score: score,
      indicators: indicators,
      recommendations: this.getImageRecommendations(score)
    };
  }

  getCategorySeverity(category) {
    const critical = ['threats', 'doxxing', 'stalking'];
    const high = ['sexualHarassment', 'humiliation'];

    if (critical.includes(category)) return 'critical';
    if (high.includes(category)) return 'high';
    return 'medium';
  }

  getSeverityWeight(category) {
    const severities = {
      threats: 20,
      doxxing: 18,
      stalking: 17,
      sexualHarassment: 15,
      humiliation: 12,
      insults: 10,
      exclusion: 8,
      impersonation: 14
    };
    return severities[category] || 8;
  }

  calculateRiskLevel(score) {
    if (score < 15) return 'low';
    if (score < 40) return 'moderate';
    if (score < 70) return 'high';
    return 'critical';
  }

  determineBullyingType(patterns) {
    const types = Object.keys(patterns);
    if (types.length === 0) return 'none';

    // Prioritize by severity
    if (patterns.threats) return 'threats';
    if (patterns.doxxing) return 'doxxing';
    if (patterns.stalking) return 'cyberstalking';
    if (patterns.sexualHarassment) return 'sexual-harassment';
    if (patterns.humiliation) return 'public-humiliation';
    if (patterns.exclusion) return 'social-exclusion';

    return 'verbal-abuse';
  }

  identifyPattern(timeline) {
    if (timeline.length === 0) return 'none';
    if (timeline.length === 1) return 'isolated-incident';
    if (timeline.length >= 5) return 'sustained-campaign';
    return 'repeated-harassment';
  }

  calculateUrgency(timeline, isCoordinated) {
    if (timeline.length === 0) return 'none';

    const recentIncidents = timeline.filter(t => {
      if (t.timestamp) {
        const hoursSince = (Date.now() - new Date(t.timestamp)) / (1000 * 60 * 60);
        return hoursSince < 24;
      }
      return true;
    });

    if (isCoordinated && recentIncidents.length > 2) return 'immediate';
    if (timeline.length >= 5) return 'high';
    if (recentIncidents.length > 0) return 'moderate';
    return 'low';
  }

  getRecommendations(score, patterns) {
    const recommendations = [];

    if (score > 70) {
      recommendations.push('🚨 SEVERE CYBERBULLYING: Immediate action required');
      recommendations.push('Document all messages with screenshots and timestamps');
      recommendations.push('Report to platform moderators immediately');
      recommendations.push('Consider contacting school officials (if applicable)');
      recommendations.push('File a police report if threats are present');
      recommendations.push('Block the person(s) involved');
    } else if (score > 40) {
      recommendations.push('⚠️ SIGNIFICANT HARASSMENT: Take protective action');
      recommendations.push('Save evidence of all interactions');
      recommendations.push('Report to platform');
      recommendations.push('Inform parents/guardians (if minor)');
      recommendations.push('Block and do not engage');
      recommendations.push('Consider adjusting privacy settings');
    } else if (score > 15) {
      recommendations.push('⚠️ CONCERNING BEHAVIOR: Monitor and protect');
      recommendations.push('Save messages as evidence');
      recommendations.push('Report if behavior continues');
      recommendations.push('Block if necessary');
      recommendations.push('Talk to trusted adult');
    }

    // Specific recommendations based on pattern types
    if (patterns.threats) {
      recommendations.push('Threats of violence should be reported to law enforcement');
      recommendations.push('Contact: National Suicide Prevention Lifeline at 988');
    }
    if (patterns.doxxing) {
      recommendations.push('Contact platform immediately about personal information being shared');
      recommendations.push('Consider identity theft monitoring');
    }
    if (patterns.sexualHarassment) {
      recommendations.push('Sexual harassment is illegal - document and report');
      recommendations.push('Contact: RAINN at 1-800-656-4673');
    }

    return recommendations;
  }

  getImageRecommendations(score) {
    const recommendations = [];

    if (score > 30) {
      recommendations.push('This image may be used for cyberbullying purposes');
      recommendations.push('Report to platform if it violates terms');
      recommendations.push('Request removal if it\'s your image');
      recommendations.push('Document for potential legal action');
    } else if (score > 20) {
      recommendations.push('Image shows potential bullying content');
      recommendations.push('Consider context before sharing');
      recommendations.push('Report if targeting someone');
    }

    return recommendations;
  }
}

module.exports = new CyberbullyingDetectionService();
