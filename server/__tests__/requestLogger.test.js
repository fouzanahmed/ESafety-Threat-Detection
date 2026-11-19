jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

const express = require('express');
const request = require('supertest');

const logger = require('../utils/logger');
const requestLogger = require('../middleware/requestLogger');
const errorHandler = require('../middleware/errorHandler');

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function buildApp() {
  const app = express();
  app.use(requestLogger);
  app.get('/ok', (req, res) => res.json({ id: req.id }));
  app.get('/missing', (req, res) => res.status(404).json({ error: 'nope' }));
  app.get('/boom', () => {
    const err = new Error('kaboom');
    err.statusCode = 503;
    throw err;
  });
  app.use(errorHandler);
  return app;
}

// The 'finish' listener can fire just after supertest resolves, so wait for
// the completion log line before asserting on it.
async function waitForCompletionLog() {
  for (let i = 0; i < 50; i += 1) {
    const call = logger.info.mock.calls.find(([msg]) => msg === 'request completed');
    if (call) return call[1];
    await new Promise((resolve) => setImmediate(resolve));
  }
  throw new Error('request completed log was never written');
}

describe('requestLogger middleware', () => {
  const app = buildApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('generates a UUID v4 X-Request-Id and exposes it as req.id', async () => {
    const res = await request(app).get('/ok');

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toMatch(UUID_V4);
    expect(res.body.id).toBe(res.headers['x-request-id']);
  });

  test('forwards a valid incoming X-Request-Id', async () => {
    const res = await request(app).get('/ok').set('X-Request-Id', 'upstream-abc.123_XYZ');

    expect(res.headers['x-request-id']).toBe('upstream-abc.123_XYZ');
    expect(res.body.id).toBe('upstream-abc.123_XYZ');
  });

  test.each([
    ['contains unsafe characters', 'bad id\twith<script>'],
    ['is too long', 'a'.repeat(129)]
  ])('replaces an incoming X-Request-Id that %s', async (_label, value) => {
    const res = await request(app).get('/ok').set('X-Request-Id', value);

    expect(res.headers['x-request-id']).not.toBe(value);
    expect(res.headers['x-request-id']).toMatch(UUID_V4);
  });

  test('logs method, path, status and durationMs on finish', async () => {
    const res = await request(app).get('/missing?q=secret');
    const meta = await waitForCompletionLog();

    expect(meta).toEqual({
      requestId: res.headers['x-request-id'],
      method: 'GET',
      path: '/missing',
      status: 404,
      durationMs: expect.any(Number)
    });
    expect(meta.durationMs).toBeGreaterThanOrEqual(0);
  });

  test('errorHandler includes the request ID in its error log', async () => {
    const res = await request(app).get('/boom');

    expect(res.status).toBe(503);
    expect(logger.error).toHaveBeenCalledWith('Error:', expect.objectContaining({
      message: 'kaboom',
      path: '/boom',
      method: 'GET',
      requestId: res.headers['x-request-id']
    }));

    const meta = await waitForCompletionLog();
    expect(meta.status).toBe(503);
    expect(meta.requestId).toBe(res.headers['x-request-id']);
  });
});
