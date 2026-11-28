// Deterministic unit tests for the rule-based grooming detector.
// No AI providers are involved: the service is pure string matching + scoring,
// so every expected number below is derived directly from the pattern lists and
// weights in server/services/groomingDetectionService.js
// (critical = 15, high = 12, medium = 8 per match).

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

const groomingService = require('../services/groomingDetectionService');

describe('groomingDetectionService.calculateRiskLevel', () => {
  test.each([
    [0, 'low'],
    [19.99, 'low'],
    [20, 'moderate'],
    [39.99, 'moderate'],
    [40, 'high'],
    [59.99, 'high'],
    [60, 'critical'],
    [100, 'critical'],
    [250, 'critical']
  ])('score %p -> %p', (score, expected) => {
    expect(groomingService.calculateRiskLevel(score)).toBe(expected);
  });
});

describe('groomingDetectionService.getCategorySeverity', () => {
  test.each([
    ['solicitation', 'critical'],
    ['meetingAttempts', 'critical'],
    ['desensitization', 'critical'],
    ['secrecy', 'high'],
    ['isolation', 'high'],
    ['emotionalManipulation', 'high'],
    ['trustBuilding', 'medium'],
    ['giftGiving', 'medium']
  ])('%s is %s', (category, expected) => {
    expect(groomingService.getCategorySeverity(category)).toBe(expected);
  });
});

describe('groomingDetectionService.analyzeText', () => {
  test('benign text scores zero with no detected patterns', () => {
    const result = groomingService.analyzeText('Hello, how was school today?');

    expect(result).toEqual({
      isGrooming: false,
      threatScore: 0,
      detectedPatterns: {},
      riskLevel: 'low',
      recommendations: [
        'No strong grooming patterns detected',
        'Continue monitoring conversations for safety'
      ]
    });
  });

  test('a single medium-severity phrase scores 8 and is not flagged', () => {
    const result = groomingService.analyzeText('you can trust me');

    expect(result.threatScore).toBe(8);
    expect(result.isGrooming).toBe(false);
    expect(result.riskLevel).toBe('low');
    expect(result.detectedPatterns).toEqual({
      trustBuilding: {
        matches: ['you can trust me'],
        count: 1,
        severity: 'medium'
      }
    });
  });

  test('matching is case-insensitive', () => {
    const result = groomingService.analyzeText('YOU CAN TRUST ME');

    expect(result.threatScore).toBe(8);
    expect(result.detectedPatterns.trustBuilding.matches).toEqual(['you can trust me']);
  });

  test('score of exactly 20 is not flagged (isGrooming requires > 20) but is moderate risk', () => {
    // trustBuilding (8) + secrecy (12) = 20
    const result = groomingService.analyzeText('you can trust me, keep this secret');

    expect(result.threatScore).toBe(20);
    expect(result.isGrooming).toBe(false);
    expect(result.riskLevel).toBe('moderate');
    expect(Object.keys(result.detectedPatterns).sort()).toEqual(['secrecy', 'trustBuilding']);
    expect(result.recommendations).toEqual([
      'No strong grooming patterns detected',
      'Continue monitoring conversations for safety',
      'Secrecy requests are a major red flag'
    ]);
  });

  test('multiple matches in one category are each weighted (2 x secrecy = 24)', () => {
    const result = groomingService.analyzeText('keep this secret and delete this');

    expect(result.threatScore).toBe(24);
    expect(result.isGrooming).toBe(true);
    expect(result.riskLevel).toBe('moderate');
    expect(result.detectedPatterns.secrecy).toEqual({
      matches: ['keep this secret', 'delete this'],
      count: 2,
      severity: 'high'
    });
    expect(result.recommendations[0]).toBe(
      '⚠️ MODERATE CONCERN: Some concerning patterns detected'
    );
    expect(result.recommendations).toContain('Secrecy requests are a major red flag');
  });

  test('a score of exactly 60 is critical risk but uses the HIGH RISK recommendation tier (> 60 is urgent)', () => {
    // solicitation (2 x 15) + meetingAttempts (15) + desensitization (15) = 60
    const result = groomingService.analyzeText(
      "send me a picture, turn on camera, let's meet up, age is just a number"
    );

    expect(result.threatScore).toBe(60);
    expect(result.isGrooming).toBe(true);
    expect(result.riskLevel).toBe('critical');
    expect(result.detectedPatterns.solicitation.count).toBe(2);
    expect(result.detectedPatterns.solicitation.severity).toBe('critical');
    expect(result.detectedPatterns.meetingAttempts.count).toBe(1);
    expect(result.detectedPatterns.desensitization.count).toBe(1);
    expect(result.recommendations[0]).toBe('⚠️ HIGH RISK: Multiple grooming indicators present');
    expect(result.recommendations).toContain(
      'Never send intimate photos to strangers or online contacts'
    );
    expect(result.recommendations).toContain(
      'Never meet someone from online alone, especially if they request secrecy'
    );
    expect(result.recommendations).not.toContain('Secrecy requests are a major red flag');
  });

  test('threatScore is capped at 100 and the urgent tier is used above 60', () => {
    // 6 x solicitation (90) + 1 x meetingAttempts (15) = 105 raw
    const result = groomingService.analyzeText(
      'send me a picture, show me yourself, turn on camera, what are you wearing, ' +
        "send nudes, private photo, let's meet up"
    );

    expect(result.detectedPatterns.solicitation.count).toBe(6);
    expect(result.threatScore).toBe(100);
    expect(result.riskLevel).toBe('critical');
    expect(result.isGrooming).toBe(true);
    expect(result.recommendations[0]).toBe(
      '🚨 URGENT: Strong indicators of grooming behavior detected'
    );
  });

  test('overlapping phrases count in every category they match', () => {
    // "just between us" is a solicitation phrase and also contains the secrecy phrase "between us"
    const result = groomingService.analyzeText('this is just between us');

    expect(result.detectedPatterns.solicitation.matches).toEqual(['just between us']);
    expect(result.detectedPatterns.secrecy.matches).toEqual(['between us']);
    expect(result.threatScore).toBe(15 + 12);
  });
});

describe('groomingDetectionService.analyzeConversation', () => {
  test('an empty conversation has no active phases', () => {
    expect(groomingService.analyzeConversation([])).toEqual({
      phases: {
        targeting: false,
        trustBuilding: false,
        isolation: false,
        desensitization: false,
        exploitation: false
      },
      progressionScore: 0,
      isSystematicGrooming: false,
      urgency: 'high'
    });
  });

  test('benign messages produce no active phases', () => {
    const result = groomingService.analyzeConversation(['hi', 'how was your day?']);

    expect(Object.values(result.phases).every(v => v === false)).toBe(true);
    expect(result.progressionScore).toBe(0);
    expect(result.isSystematicGrooming).toBe(false);
  });

  test('two phases score 40 and are not systematic', () => {
    const result = groomingService.analyzeConversation(['you can trust me', "let's meet up"]);

    expect(result.phases.trustBuilding).toBe(true);
    expect(result.phases.exploitation).toBe(true);
    expect(result.phases.isolation).toBe(false);
    expect(result.progressionScore).toBe(40);
    expect(result.isSystematicGrooming).toBe(false);
    expect(result.urgency).toBe('high');
  });

  test('exactly three phases is systematic grooming with immediate urgency', () => {
    const result = groomingService.analyzeConversation([
      'you can trust me',
      "your friends don't understand",
      'send me a picture'
    ]);

    expect(result.progressionScore).toBe(60);
    expect(result.isSystematicGrooming).toBe(true);
    expect(result.urgency).toBe('immediate');
  });

  test('accepts { text } message objects and plain strings, and tracks the full progression', () => {
    const result = groomingService.analyzeConversation([
      { text: 'you can trust me' },
      { text: "your friends don't understand" },
      "you're mature for your age",
      { text: 'send me a picture' }
    ]);

    expect(result.phases).toEqual({
      targeting: false,
      trustBuilding: true,
      isolation: true,
      desensitization: true,
      exploitation: true
    });
    expect(result.progressionScore).toBe(80);
    expect(result.isSystematicGrooming).toBe(true);
    expect(result.urgency).toBe('immediate');
  });

  test('repeating the same phase across messages does not inflate the score', () => {
    const result = groomingService.analyzeConversation([
      'you can trust me',
      "i'm your friend",
      'you can tell me anything'
    ]);

    expect(result.progressionScore).toBe(20);
    expect(result.isSystematicGrooming).toBe(false);
  });

  test('meeting attempts alone mark the exploitation phase', () => {
    const result = groomingService.analyzeConversation(['meet me alone']);

    expect(result.phases.exploitation).toBe(true);
    expect(result.progressionScore).toBe(20);
  });
});
