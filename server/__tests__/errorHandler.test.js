const express = require('express');
const request = require('supertest');
const multer = require('multer');

// Silence winston and keep the tests from writing to logs/*.log.
jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
}));

const logger = require('../utils/logger');
const errorHandler = require('../middleware/errorHandler');

// Builds a tiny app whose only route forwards the given error to errorHandler.
function appThatThrows(makeError) {
  const app = express();
  app.use(express.json());
  app.post('/boom', (req, res, next) => next(makeError()));
  app.get('/boom', (req, res, next) => next(makeError()));
  app.use(errorHandler);
  return app;
}

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  jest.clearAllMocks();
});

describe('errorHandler: Multer errors', () => {
  test('LIMIT_FILE_SIZE returns 400 with the file-too-large message', async () => {
    const app = appThatThrows(() => new multer.MulterError('LIMIT_FILE_SIZE', 'image'));

    const res = await request(app).get('/boom');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'File too large',
      message: 'Maximum file size is 10MB'
    });
  });

  test('other MulterError codes return 400 with the multer message', async () => {
    const multerErr = new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'avatar');
    const app = appThatThrows(() => multerErr);

    const res = await request(app).get('/boom');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'File upload error',
      message: multerErr.message
    });
    expect(res.body.message).toBe('Unexpected field');
  });

  test('Multer errors keep their message and omit the stack in production', async () => {
    process.env.NODE_ENV = 'production';
    const app = appThatThrows(() => new multer.MulterError('LIMIT_FILE_COUNT'));

    const res = await request(app).get('/boom');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'File upload error',
      message: 'Too many files'
    });
    expect(res.body).not.toHaveProperty('stack');
  });
});

describe('errorHandler: ValidationError', () => {
  test('returns 400 with the validation message', async () => {
    const app = appThatThrows(() => {
      const err = new Error('text is required');
      err.name = 'ValidationError';
      return err;
    });

    const res = await request(app).get('/boom');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'text is required'
    });
  });
});

describe('errorHandler: default branch', () => {
  test('passes through err.statusCode and includes message + stack outside production', async () => {
    process.env.NODE_ENV = 'development';
    const app = appThatThrows(() => {
      const err = new Error('Upstream AI provider unavailable');
      err.statusCode = 503;
      return err;
    });

    const res = await request(app).get('/boom');

    expect(res.status).toBe(503);
    expect(res.body.error).toBe('Upstream AI provider unavailable');
    expect(typeof res.body.stack).toBe('string');
    expect(res.body.stack).toContain('Upstream AI provider unavailable');
  });

  test('defaults to 500 when the error has no statusCode', async () => {
    process.env.NODE_ENV = 'development';
    const app = appThatThrows(() => new Error('kaboom'));

    const res = await request(app).get('/boom');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('kaboom');
    expect(res.body).toHaveProperty('stack');
  });

  test('hides the message and stack in production', async () => {
    process.env.NODE_ENV = 'production';
    const app = appThatThrows(() => new Error('secret internal detail at /srv/db.js'));

    const res = await request(app).get('/boom');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
    expect(JSON.stringify(res.body)).not.toContain('secret internal detail');
  });

  test('keeps err.statusCode but still hides details in production', async () => {
    process.env.NODE_ENV = 'production';
    const app = appThatThrows(() => {
      const err = new Error('forbidden: token for user 42 expired');
      err.statusCode = 403;
      return err;
    });

    const res = await request(app).get('/boom');

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});

describe('errorHandler: malformed JSON body', () => {
  function jsonApp() {
    const app = express();
    app.use(express.json());
    app.post('/echo', (req, res) => res.json(req.body));
    app.use(errorHandler);
    return app;
  }

  test('body-parser SyntaxError is returned as 400 with the parse message outside production', async () => {
    process.env.NODE_ENV = 'development';

    const res = await request(jsonApp())
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send('{"text": "unterminated');

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('stack');
  });

  test('body-parser SyntaxError stays 400 but hides message and stack in production', async () => {
    process.env.NODE_ENV = 'production';

    const res = await request(jsonApp())
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send('{not json');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});

describe('errorHandler: logging', () => {
  test('logs the error with message, stack, path and method', async () => {
    const app = appThatThrows(() => new Error('log me'));

    await request(app).post('/boom').send({});

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      'Error:',
      expect.objectContaining({
        message: 'log me',
        stack: expect.any(String),
        path: '/boom',
        method: 'POST'
      })
    );
  });
});
