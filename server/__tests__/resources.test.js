const express = require('express');
const request = require('supertest');

const resourcesRoutes = require('../routes/resources');
const resourcesData = require('../data/resources');
const errorHandler = require('../middleware/errorHandler');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/resources', resourcesRoutes);
  app.use(errorHandler);
  return app;
}

const app = buildApp();

const EXPECTED_CATEGORIES = [
  'incel',
  'mgtow',
  'pua',
  'grooming',
  'extremist',
  'concerning',
  'safe',
  'general'
];

describe('GET /api/resources', () => {
  test('returns every category from server/data/resources.js', async () => {
    const res = await request(app).get('/api/resources');

    expect(res.status).toBe(200);
    expect(Object.keys(res.body).sort()).toEqual([...EXPECTED_CATEGORIES].sort());
    expect(res.body).toEqual(resourcesData);
  });
});

describe('GET /api/resources/:category', () => {
  test('returns the resources for a known category', async () => {
    const res = await request(app).get('/api/resources/grooming');

    expect(res.status).toBe(200);
    expect(res.body.category).toBe('grooming');
    expect(res.body.resources).toEqual(resourcesData.grooming);
    expect(res.body.resources).toHaveProperty('title');
  });

  test('returns 404 for an unknown category', async () => {
    const res = await request(app).get('/api/resources/not-a-category');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Category not found' });
  });

  test.each(['constructor', 'toString', 'hasOwnProperty', '__proto__'])(
    'returns 404 for inherited Object.prototype key %s',
    async (key) => {
      const res = await request(app).get(`/api/resources/${key}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Category not found' });
    }
  );
});

describe('POST /api/resources/feedback', () => {
  test('acknowledges submitted feedback', async () => {
    const res = await request(app)
      .post('/api/resources/feedback')
      .send({ analysisId: 'abc123', feedback: 'useful', helpful: true });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Thank you for your feedback',
      received: true
    });
  });

  test('acknowledges an empty feedback body', async () => {
    const res = await request(app).post('/api/resources/feedback').send({});

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });
});
