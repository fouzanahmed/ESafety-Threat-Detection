const request = require('supertest');

// Mock the AI-backed services so requiring the real app never needs API keys
// or makes network calls.
jest.mock('../services/aiService');
jest.mock('../services/urlService');

const app = require('../index');

describe('GET /health', () => {
  test('returns status ok with a timestamp and uptime', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.timestamp).toBe('string');
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });

  test('includes helmet security headers', async () => {
    const res = await request(app).get('/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

describe('404 handler', () => {
  test('returns JSON 404 for an unknown route', async () => {
    const res = await request(app).get('/definitely-not-a-route');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ error: 'Route not found' });
  });

  test('returns JSON 404 for an unknown /api path', async () => {
    const res = await request(app).post('/api/unknown-endpoint').send({});

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route not found' });
  });
});

describe('rate limiter', () => {
  test('applies rate-limit headers to /api routes', async () => {
    const res = await request(app).get('/api/resources');

    // express-rate-limit v7 sends legacy X-RateLimit-* headers by default.
    expect(res.headers['x-ratelimit-limit']).toBeDefined();
    expect(res.headers['x-ratelimit-remaining']).toBeDefined();
  });
});
