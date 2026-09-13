const express = require('express');
const request = require('supertest');

jest.mock('../services/aiService');
jest.mock('../services/urlService');

const aiService = require('../services/aiService');
const urlService = require('../services/urlService');
const analysisRoutes = require('../routes/analysis');
const errorHandler = require('../middleware/errorHandler');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/analyze', analysisRoutes);
  app.use(errorHandler);
  return app;
}

const app = buildApp();

const fakeAiAnalysis = {
  threatScore: 42,
  category: 'concerning',
  confidence: 0.8,
  explanation: 'mocked analysis'
};

beforeEach(() => {
  jest.clearAllMocks();
  aiService.analyzeContent.mockResolvedValue({ ...fakeAiAnalysis });
});

describe('POST /api/analyze/text', () => {
  test('rejects missing text', async () => {
    const res = await request(app).post('/api/analyze/text').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test('rejects text over 50000 characters', async () => {
    const res = await request(app)
      .post('/api/analyze/text')
      .send({ text: 'a'.repeat(50001) });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/too long/i);
  });

  test('returns a threat analysis for valid text', async () => {
    const res = await request(app)
      .post('/api/analyze/text')
      .send({ text: 'hello world, this is a normal sentence' });

    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('text');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('threatScore');
    expect(res.body).toHaveProperty('category');
    expect(res.body).toHaveProperty('recommendations');
    expect(aiService.analyzeContent).toHaveBeenCalledWith(
      'hello world, this is a normal sentence',
      'text'
    );
  });
});

describe('POST /api/analyze/url', () => {
  test('rejects missing url', async () => {
    const res = await request(app).post('/api/analyze/url').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/url is required/i);
  });

  test('rejects invalid url', async () => {
    const res = await request(app)
      .post('/api/analyze/url')
      .send({ url: 'not-a-url' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/url is required/i);
  });

  test('analyzes a web url', async () => {
    urlService.detectContentType.mockReturnValue('web');
    urlService.extractContent.mockResolvedValue({
      text: 'some page content',
      metadata: { title: 'Example' }
    });

    const res = await request(app)
      .post('/api/analyze/url')
      .send({ url: 'https://example.com/article' });

    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('web');
    expect(res.body.url).toBe('https://example.com/article');
    expect(res.body.threatScore).toBe(fakeAiAnalysis.threatScore);
    expect(res.body.category).toBe(fakeAiAnalysis.category);
    expect(urlService.extractContent).toHaveBeenCalledWith('https://example.com/article');
  });

  test('propagates url extraction failures through the error handler', async () => {
    urlService.detectContentType.mockReturnValue('web');
    urlService.extractContent.mockRejectedValue(new Error('extraction failed'));

    const res = await request(app)
      .post('/api/analyze/url')
      .send({ url: 'https://example.com/broken' });

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/extraction failed/i);
  });
});

describe('POST /api/analyze/batch', () => {
  test('rejects a non-array items payload', async () => {
    const res = await request(app).post('/api/analyze/batch').send({ items: 'nope' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/items array/i);
  });

  test('rejects more than 10 items', async () => {
    const items = Array.from({ length: 11 }, () => ({ type: 'text', content: 'x' }));
    const res = await request(app).post('/api/analyze/batch').send({ items });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/maximum 10/i);
  });

  test('analyzes a mixed batch of text and url items', async () => {
    urlService.extractContent.mockResolvedValue({ text: 'url page text' });

    const items = [
      { type: 'text', content: 'some text content' },
      { type: 'url', content: 'https://example.com' }
    ];

    const res = await request(app).post('/api/analyze/batch').send({ items });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.results).toHaveLength(2);
    // analyzeTextInternal blends the AI score (70%) with a rule-based score (30%);
    // "some text content" matches no rule-based patterns, so only the AI weight applies.
    expect(res.body.results[0].threatScore).toBe(Math.round(fakeAiAnalysis.threatScore * 0.7));
    expect(res.body.results[1].url).toBe('https://example.com');
    expect(res.body.results[1].threatScore).toBe(fakeAiAnalysis.threatScore);
  });
});

describe('POST /api/analyze/grooming', () => {
  test('rejects missing text and messages', async () => {
    const res = await request(app).post('/api/analyze/grooming').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/text or messages/i);
  });

  test('flags text containing multiple grooming patterns', async () => {
    const text = 'you can trust me, keep this secret and send me a picture';
    const res = await request(app).post('/api/analyze/grooming').send({ text });

    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('grooming-analysis');
    expect(res.body.isGrooming).toBe(true);
    expect(res.body.threatScore).toBeGreaterThan(20);
    expect(res.body.detectedPatterns).toHaveProperty('trustBuilding');
    expect(res.body.detectedPatterns).toHaveProperty('secrecy');
    expect(res.body.detectedPatterns).toHaveProperty('solicitation');
  });

  test('returns low risk with safe text', async () => {
    const res = await request(app)
      .post('/api/analyze/grooming')
      .send({ text: 'looking forward to the school project tomorrow' });

    expect(res.status).toBe(200);
    expect(res.body.isGrooming).toBe(false);
    expect(res.body.riskLevel).toBe('low');
  });

  test('analyzes a conversation thread when messages are provided', async () => {
    const messages = [
      { text: 'you can trust me' },
      { text: 'keep this secret, our secret' },
      { text: 'send me a picture' }
    ];
    const res = await request(app).post('/api/analyze/grooming').send({ messages });

    expect(res.status).toBe(200);
    expect(res.body.conversationAnalysis).not.toBeNull();
    expect(res.body.conversationAnalysis).toHaveProperty('progressionScore');
  });
});

describe('POST /api/analyze/cyberbullying', () => {
  test('rejects missing text and messages', async () => {
    const res = await request(app).post('/api/analyze/cyberbullying').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/text or messages/i);
  });

  test('flags text containing threats and insults', async () => {
    const res = await request(app)
      .post('/api/analyze/cyberbullying')
      .send({ text: 'you are so ugly, kill yourself' });

    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('cyberbullying-analysis');
    expect(res.body.isCyberbullying).toBe(true);
    expect(res.body.bullyingType).toBe('threats');
  });

  test('analyzes a message thread when messages are provided', async () => {
    const messages = [
      { text: 'you are so ugly', senderId: 'a' },
      { text: 'nobody wants you, go away', senderId: 'b' },
      { text: 'kill yourself', senderId: 'c' }
    ];
    const res = await request(app)
      .post('/api/analyze/cyberbullying')
      .send({ messages });

    expect(res.status).toBe(200);
    expect(res.body.threadAnalysis).not.toBeNull();
    expect(res.body.threadAnalysis.totalIncidents).toBeGreaterThan(0);
  });
});

describe('POST /api/analyze/conversation', () => {
  test('rejects missing messages', async () => {
    const res = await request(app).post('/api/analyze/conversation').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/messages array/i);
  });

  test('returns a combined analysis for a message thread', async () => {
    const messages = [
      { text: 'you can trust me, keep this secret' },
      { text: 'send me a picture, meet in person' }
    ];

    const res = await request(app).post('/api/analyze/conversation').send({ messages });

    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('conversation-analysis');
    expect(res.body.messageCount).toBe(2);
    expect(res.body).toHaveProperty('overallThreatScore');
    expect(res.body.grooming).toHaveProperty('detected');
    expect(res.body.cyberbullying).toHaveProperty('detected');
    expect(res.body.aiAnalysis.category).toBe(fakeAiAnalysis.category);
    expect(aiService.analyzeContent).toHaveBeenCalledWith(expect.any(String), 'conversation');
  });
});
