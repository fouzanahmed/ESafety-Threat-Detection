// Deterministic unit tests for the rule-based cyberbullying detector.
// No AI providers are involved: expected numbers below come straight from the
// pattern lists, per-category weights (threats 20, doxxing 18, stalking 17,
// sexualHarassment 15, impersonation 14, humiliation 12, insults 10,
// exclusion 8) and multipliers (public 1.3, repetition 1.5, coordinated 2.0)
// in server/services/cyberbullyingDetectionService.js.

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

const bullyingService = require('../services/cyberbullyingDetectionService');

describe('cyberbullyingDetectionService.calculateRiskLevel', () => {
  test.each([
    [0, 'low'],
    [14.99, 'low'],
    [15, 'moderate'],
    [39.99, 'moderate'],
    [40, 'high'],
    [69.99, 'high'],
    [70, 'critical'],
    [100, 'critical'],
    [250, 'critical']
  ])('score %p -> %p', (score, expected) => {
    expect(bullyingService.calculateRiskLevel(score)).toBe(expected);
  });
});

describe('cyberbullyingDetectionService.determineBullyingType', () => {
  const hit = { matches: ['x'], count: 1, severity: 'medium' };

  test.each([
    [{}, 'none'],
    [{ insults: hit }, 'verbal-abuse'],
    [{ impersonation: hit }, 'verbal-abuse'],
    [{ exclusion: hit, insults: hit }, 'social-exclusion'],
    [{ humiliation: hit, exclusion: hit }, 'public-humiliation'],
    [{ sexualHarassment: hit, humiliation: hit }, 'sexual-harassment'],
    [{ stalking: hit, sexualHarassment: hit }, 'cyberstalking'],
    [{ doxxing: hit, stalking: hit }, 'doxxing'],
    [{ insults: hit, doxxing: hit, threats: hit }, 'threats']
  ])('%j -> %s', (patterns, expected) => {
    expect(bullyingService.determineBullyingType(patterns)).toBe(expected);
  });
});

describe('cyberbullyingDetectionService.analyzeMessage', () => {
  test('benign text scores zero with no patterns or recommendations', () => {
    const result = bullyingService.analyzeMessage(
      'Thanks for the help with homework, see you tomorrow'
    );

    expect(result).toEqual({
      isCyberbullying: false,
      threatScore: 0,
      detectedPatterns: {},
      riskLevel: 'low',
      bullyingType: 'none',
      recommendations: []
    });
  });

  test('a single insult scores 10, is low risk and not flagged', () => {
    const result = bullyingService.analyzeMessage('you are an idiot');

    expect(result.threatScore).toBe(10);
    expect(result.isCyberbullying).toBe(false);
    expect(result.riskLevel).toBe('low');
    expect(result.bullyingType).toBe('verbal-abuse');
    expect(result.detectedPatterns).toEqual({
      insults: { matches: ['idiot'], count: 1, severity: 'medium' }
    });
    expect(result.recommendations).toEqual([]);
  });

  test('matching is case-insensitive', () => {
    const result = bullyingService.analyzeMessage('YOU ARE AN IDIOT');

    expect(result.threatScore).toBe(10);
    expect(result.detectedPatterns.insults.matches).toEqual(['idiot']);
  });

  test('a score of exactly 15 is moderate risk but not flagged (isCyberbullying requires > 15)', () => {
    const result = bullyingService.analyzeMessage('you slut');

    expect(result.threatScore).toBe(15);
    expect(result.isCyberbullying).toBe(false);
    expect(result.riskLevel).toBe('moderate');
    expect(result.bullyingType).toBe('sexual-harassment');
    expect(result.detectedPatterns.sexualHarassment.severity).toBe('high');
    // No score-tier recommendation at 15, but category-specific ones still apply
    expect(result.recommendations).toEqual([
      'Sexual harassment is illegal - document and report',
      'Contact: RAINN at 1-800-656-4673'
    ]);
  });

  test('a word listed in two categories counts in both (pathetic = insult + humiliation)', () => {
    const result = bullyingService.analyzeMessage('you are pathetic');

    expect(result.detectedPatterns.insults.matches).toEqual(['pathetic']);
    expect(result.detectedPatterns.humiliation.matches).toEqual(['pathetic']);
    expect(result.threatScore).toBe(22);
    expect(result.isCyberbullying).toBe(true);
    expect(result.riskLevel).toBe('moderate');
    expect(result.bullyingType).toBe('public-humiliation');
    expect(result.recommendations[0]).toBe('⚠️ CONCERNING BEHAVIOR: Monitor and protect');
  });

  test.each([
    [{}, 10, false],
    [{ isPublic: true }, 13, false],
    [{ isRepeated: true }, 15, false],
    [{ isCoordinated: true }, 20, true],
    [{ isPublic: true, isRepeated: true }, 20, true],
    [{ isPublic: true, isRepeated: true, isCoordinated: true }, 39, true]
  ])('metadata %j multiplies a base score of 10 to %p', (metadata, expectedScore, flagged) => {
    const result = bullyingService.analyzeMessage('you are an idiot', metadata);

    expect(result.threatScore).toBe(expectedScore);
    expect(result.isCyberbullying).toBe(flagged);
  });

  test('threats produce critical risk with threat-specific recommendations', () => {
    // 4 x threats (20 each) = 80
    const result = bullyingService.analyzeMessage(
      'kill yourself, kys, wish you were dead, better off dead'
    );

    expect(result.detectedPatterns.threats.count).toBe(4);
    expect(result.detectedPatterns.threats.severity).toBe('critical');
    expect(result.threatScore).toBe(80);
    expect(result.riskLevel).toBe('critical');
    expect(result.bullyingType).toBe('threats');
    expect(result.recommendations[0]).toBe(
      '🚨 SEVERE CYBERBULLYING: Immediate action required'
    );
    expect(result.recommendations).toContain(
      'Threats of violence should be reported to law enforcement'
    );
    expect(result.recommendations).toContain('Contact: National Suicide Prevention Lifeline at 988');
  });

  test('threatScore is capped at 100 after multipliers are applied', () => {
    const result = bullyingService.analyzeMessage(
      'kill yourself, kys, wish you were dead, better off dead',
      { isPublic: true }
    );

    expect(result.threatScore).toBe(100);
    expect(result.riskLevel).toBe('critical');
  });

  test('doxxing scores 18 per match with doxxing-specific recommendations', () => {
    const result = bullyingService.analyzeMessage("i'll post your address and expose you");

    expect(result.detectedPatterns.doxxing.matches).toEqual(['post your address', 'expose you']);
    expect(result.threatScore).toBe(36);
    expect(result.riskLevel).toBe('moderate');
    expect(result.bullyingType).toBe('doxxing');
    expect(result.recommendations).toContain(
      'Contact platform immediately about personal information being shared'
    );
  });

  test('a score above 40 uses the SIGNIFICANT HARASSMENT tier', () => {
    // stalking: "watching you" + "know where you live" = 2 x 17 = 34; insults: "loser" = 10 -> 44
    const result = bullyingService.analyzeMessage('loser, i am watching you and know where you live');

    expect(result.threatScore).toBe(44);
    expect(result.riskLevel).toBe('high');
    expect(result.bullyingType).toBe('cyberstalking');
    expect(result.recommendations[0]).toBe('⚠️ SIGNIFICANT HARASSMENT: Take protective action');
  });
});

describe('cyberbullyingDetectionService.analyzeThread', () => {
  test('an empty thread reports no incidents', () => {
    expect(bullyingService.analyzeThread([])).toEqual({
      totalIncidents: 0,
      timeline: [],
      isPersistent: false,
      isCoordinated: false,
      attackerCount: 0,
      overallThreatScore: 0,
      pattern: 'none',
      urgency: 'none'
    });
  });

  test('a single flagged message is an isolated incident with no persistence score', () => {
    const result = bullyingService.analyzeThread([
      { text: 'you are pathetic', senderId: 'a', timestamp: '2020-01-01T00:00:00Z' }
    ]);

    expect(result.totalIncidents).toBe(1);
    expect(result.timeline).toEqual([
      { index: 0, timestamp: '2020-01-01T00:00:00Z', score: 22, type: 'public-humiliation' }
    ]);
    expect(result.overallThreatScore).toBe(0);
    expect(result.pattern).toBe('isolated-incident');
    expect(result.attackerCount).toBe(1);
    // Timestamp is years old, so it is not a recent incident
    expect(result.urgency).toBe('low');
  });

  test('messages without timestamps count as recent', () => {
    const result = bullyingService.analyzeThread(['you are pathetic']);

    expect(result.totalIncidents).toBe(1);
    expect(result.urgency).toBe('moderate');
  });

  test('messages after the first get the repetition multiplier', () => {
    // A lone insult (10) is not flagged at index 0, but 10 x 1.5 = 15 is still not > 15,
    // while "pathetic" (22) becomes 33 at index 1.
    const result = bullyingService.analyzeThread([
      'you are an idiot',
      'you are an idiot',
      'you are pathetic'
    ]);

    expect(result.totalIncidents).toBe(1);
    expect(result.timeline[0]).toMatchObject({ index: 2, score: 33 });
  });

  test('the isPublic flag on a message is applied', () => {
    // pathetic (22) x public 1.3 = 28.6 -> 29
    const result = bullyingService.analyzeThread([{ text: 'you are pathetic', isPublic: true }]);

    expect(result.timeline[0].score).toBe(29);
  });

  test('three distinct senders is a coordinated, persistent attack with immediate urgency', () => {
    const result = bullyingService.analyzeThread([
      { text: 'you are pathetic', senderId: 'a' },
      { text: 'you are pathetic', senderId: 'b' },
      { text: 'you are pathetic', senderId: 'c' },
      { text: 'see you at practice', senderId: 'd' }
    ]);

    expect(result.totalIncidents).toBe(3);
    expect(result.timeline.map(t => t.score)).toEqual([22, 33, 33]);
    expect(result.isPersistent).toBe(true);
    expect(result.isCoordinated).toBe(true);
    // Sender "d" sent nothing harmful and is not counted as an attacker
    expect(result.attackerCount).toBe(3);
    // persistence 3 x 10 + coordinated bonus 30
    expect(result.overallThreatScore).toBe(60);
    expect(result.pattern).toBe('repeated-harassment');
    expect(result.urgency).toBe('immediate');
  });

  test('two senders is not coordinated', () => {
    const result = bullyingService.analyzeThread([
      { text: 'you are pathetic', senderId: 'a' },
      { text: 'you are pathetic', senderId: 'b' }
    ]);

    expect(result.isCoordinated).toBe(false);
    expect(result.isPersistent).toBe(false);
    expect(result.overallThreatScore).toBe(20);
  });

  test('five or more old incidents from one sender is a sustained campaign with high urgency', () => {
    const old = '2020-01-01T00:00:00Z';
    const messages = Array.from({ length: 5 }, () => ({
      text: 'you are pathetic',
      senderId: 'a',
      timestamp: old
    }));

    const result = bullyingService.analyzeThread(messages);

    expect(result.totalIncidents).toBe(5);
    expect(result.isPersistent).toBe(true);
    expect(result.isCoordinated).toBe(false);
    expect(result.attackerCount).toBe(1);
    expect(result.overallThreatScore).toBe(50);
    expect(result.pattern).toBe('sustained-campaign');
    expect(result.urgency).toBe('high');
  });

  test('overallThreatScore is capped at 100', () => {
    const messages = Array.from({ length: 12 }, (_, i) => ({
      text: 'you are pathetic',
      senderId: `user-${i}`
    }));

    const result = bullyingService.analyzeThread(messages);

    expect(result.totalIncidents).toBe(12);
    expect(result.overallThreatScore).toBe(100);
  });
});
