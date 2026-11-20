const express = require('express');
const request = require('supertest');

jest.mock('../services/aiService');
jest.mock('../services/imageService');

const aiService = require('../services/aiService');
const imageService = require('../services/imageService');
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

// Minimal PNG signature bytes; imageService is mocked, so the content
// only needs to travel through multer as an image/png upload.
const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const fakeImageAnalysis = {
  threatScore: 20,
  category: 'safe',
  confidence: 0.9,
  explanation: 'mocked image analysis'
};

beforeEach(() => {
  jest.clearAllMocks();
  imageService.processImage.mockImplementation(async (buffer) => buffer);
  imageService.extractText.mockResolvedValue('');
  aiService.analyzeImage.mockResolvedValue({ ...fakeImageAnalysis });
  aiService.analyzeContent.mockResolvedValue({ ...fakeImageAnalysis });
});

describe('POST /api/analyze/image', () => {
  test('returns 400 when no file is uploaded', async () => {
    const res = await request(app).post('/api/analyze/image');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Image file is required');
    expect(imageService.processImage).not.toHaveBeenCalled();
  });

  test('returns 400 for a disallowed mimetype', async () => {
    const res = await request(app)
      .post('/api/analyze/image')
      .attach('image', Buffer.from('not an image'), {
        filename: 'notes.txt',
        contentType: 'text/plain'
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid file type/i);
    expect(imageService.processImage).not.toHaveBeenCalled();
  });

  test('returns 200 with an analysis for a valid PNG', async () => {
    const res = await request(app)
      .post('/api/analyze/image')
      .attach('image', pngBuffer, { filename: 'pic.png', contentType: 'image/png' });

    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('image');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('threatScore');
    expect(res.body).toHaveProperty('recommendations');
    expect(imageService.processImage).toHaveBeenCalledTimes(1);
    expect(Buffer.compare(imageService.processImage.mock.calls[0][0], pngBuffer)).toBe(0);
    expect(aiService.analyzeImage).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/analyze/images', () => {
  test('returns 400 when no files are uploaded', async () => {
    const res = await request(app).post('/api/analyze/images');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('At least one image file is required');
  });

  test('returns 400 when any file has a disallowed mimetype', async () => {
    const res = await request(app)
      .post('/api/analyze/images')
      .attach('images', pngBuffer, { filename: 'a.png', contentType: 'image/png' })
      .attach('images', Buffer.from('%PDF-1.4'), {
        filename: 'doc.pdf',
        contentType: 'application/pdf'
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid file type/i);
  });

  test('analyzes several valid images', async () => {
    const res = await request(app)
      .post('/api/analyze/images')
      .attach('images', pngBuffer, { filename: 'a.png', contentType: 'image/png' })
      .attach('images', pngBuffer, { filename: 'b.png', contentType: 'image/png' })
      .attach('images', pngBuffer, { filename: 'c.png', contentType: 'image/png' });

    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('multi-image');
    expect(res.body.totalImages).toBe(3);
    expect(res.body.individualResults).toHaveLength(3);
    expect(res.body.individualResults.map(r => r.imageIndex)).toEqual([1, 2, 3]);
    expect(res.body).toHaveProperty('overallThreatScore');
    expect(imageService.processImage).toHaveBeenCalledTimes(3);
  });
});

describe('POST /api/analyze/deepfake', () => {
  test('returns 400 when no file is uploaded', async () => {
    const res = await request(app).post('/api/analyze/deepfake');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Image file is required');
  });

  test('returns 400 for a disallowed mimetype', async () => {
    const res = await request(app)
      .post('/api/analyze/deepfake')
      .attach('image', Buffer.from('GIF-ish but wrong'), {
        filename: 'clip.mp4',
        contentType: 'video/mp4'
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid file type/i);
  });

  test('returns 200 with a deepfake analysis for a valid PNG', async () => {
    const res = await request(app)
      .post('/api/analyze/deepfake')
      .attach('image', pngBuffer, { filename: 'face.png', contentType: 'image/png' });

    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('deepfake-analysis');
    expect(res.body).toHaveProperty('isLikelyDeepfake');
    expect(res.body).toHaveProperty('riskLevel');
    expect(res.body.aiAnalysis).toBe(fakeImageAnalysis.explanation);
    expect(aiService.analyzeImage).toHaveBeenCalledTimes(1);
    // The deepfake endpoint passes a dedicated prompt as the second argument
    expect(typeof aiService.analyzeImage.mock.calls[0][1]).toBe('string');
  });
});
