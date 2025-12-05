# Technical Documentation

## Architecture Overview

ESafety Threat Detection is a full-stack web application with the following architecture:

```
┌─────────────────┐
│   React Frontend│
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express API    │
│   (Port 5000)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│  AI  │  │ NLP  │
│Service│ │Service│
└───┬──┘  └──┬───┘
    │        │
┌───▼────────▼───┐
│  OpenAI/Google │
│   Gemini API   │
└────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI Integration**: OpenAI GPT-4, Google Gemini
- **NLP**: Natural.js, Compromise
- **Image Processing**: Sharp
- **Database**: MongoDB (optional)
- **Cache**: Redis (optional)

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **File Upload**: React Dropzone

## Project Structure

```
esafety-threat-detection/
├── server/
│   ├── index.js                 # Express app entry
│   ├── routes/
│   │   ├── analysis.js          # Analysis endpoints
│   │   └── resources.js         # Resources endpoints
│   ├── controllers/
│   │   ├── analysisController.js
│   │   └── resourcesController.js
│   ├── services/
│   │   ├── aiService.js         # AI integration
│   │   ├── nlpService.js        # NLP analysis
│   │   ├── imageService.js      # Image processing
│   │   └── urlService.js        # URL content extraction
│   ├── models/
│   │   ├── Analysis.js          # Analysis schema
│   │   └── Feedback.js          # Feedback schema
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling
│   ├── utils/
│   │   └── logger.js            # Winston logger
│   ├── data/
│   │   └── resources.js         # Help resources
│   └── config/
│       └── database.js          # MongoDB config
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TextAnalysis.js
│   │   │   ├── ImageAnalysis.js
│   │   │   └── URLAnalysis.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ResultsPage.js
│   │   │   ├── AboutPage.js
│   │   │   └── ResourcesPage.js
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
├── .env.example
└── docker-compose.yml
```

## API Endpoints

### Analysis Endpoints

#### POST /api/analyze/text
Analyze text content for threats.

**Request:**
```json
{
  "text": "Content to analyze..."
}
```

**Response:**
```json
{
  "id": "uuid",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "contentType": "text",
  "threatScore": 75,
  "category": "incel",
  "explanation": "Contains dehumanizing language toward women...",
  "confidence": 0.85,
  "detectedPatterns": [
    {
      "category": "incel",
      "pattern": "femoid",
      "count": 2
    }
  ],
  "recommendations": [
    "Consider reporting this content...",
    "Document for your records..."
  ]
}
```

#### POST /api/analyze/image
Analyze uploaded image.

**Request:** `multipart/form-data`
- `image`: File (max 10MB)

**Response:** Same structure as text analysis

#### POST /api/analyze/url
Analyze content from URL.

**Request:**
```json
{
  "url": "https://example.com/content"
}
```

**Response:** Same structure with additional metadata

### Resource Endpoints

#### GET /api/resources/:category
Get help resources for specific category.

**Response:**
```json
{
  "category": "grooming",
  "resources": {
    "title": "Child Safety Resources",
    "helplines": [...],
    "resources": [...],
    "actions": [...]
  }
}
```

## AI Analysis Pipeline

### 1. Input Processing

```javascript
// Text preprocessing
const preprocessed = nlpService.preprocessText(text);
// Result: tokenized, cleaned, sentiment analyzed
```

### 2. AI Analysis

```javascript
// Multi-provider support
if (openai) {
  result = await analyzeWithOpenAI(text);
} else if (gemini) {
  result = await analyzeWithGemini(text);
} else {
  result = fallbackAnalysis(text);
}
```

### 3. Rule-Based Analysis

```javascript
// Pattern matching
const patterns = nlpService.analyzePatterns(preprocessed);
// Detects: incel, mgtow, pua, grooming, extremist keywords
```

### 4. Score Calculation

```javascript
// Weighted combination
threatScore = (aiScore * 0.7) + (ruleScore * 0.3);
```

### 5. Category Determination

```javascript
// Severity hierarchy
const categories = [
  'safe',      // 0-30
  'concerning', // 30-60
  'incel',     // 60+
  'mgtow',     // 60+
  'pua',       // 60+
  'grooming',  // 60+ (highest priority)
  'extremist'  // 60+ (highest priority)
];
```

## Pattern Detection

### Keyword Dictionaries

```javascript
// Incel patterns
['blackpill', 'femoid', 'roastie', 'chad', 'stacy']

// MGTOW patterns
['awalt', 'gynocentrism', 'divorce rape', 'the wall']

// PUA patterns
['neg', 'kino', 'amog', 'dhv', 'ioi']

// Grooming patterns
['age is just a number', 'our secret', 'dont tell']

// Extremist patterns
['race war', 'cleanse', 'purge', 'supremacy']
```

### Scoring Weights

```javascript
violence:       15 points per match
extremist:      12 points per match
grooming:       10 points per match
dehumanization: 8 points per match
incel:          6 points per match
mgtow:          5 points per match
pua:            4 points per match
```

## Image Analysis

### Processing Pipeline

1. **Resize & Optimize**
   ```javascript
   await sharp(buffer)
     .resize(1920, 1920, { fit: 'inside' })
     .jpeg({ quality: 85 })
   ```

2. **OCR (Optional)**
   - Extract text from images
   - Tesseract.js integration ready

3. **AI Vision Analysis**
   - GPT-4 Vision or Gemini Vision
   - Analyzes visual content and context

4. **Combined Analysis**
   ```javascript
   score = max(imageScore, textScore)
   ```

## URL Content Extraction

### Supported Platforms

- YouTube (video metadata)
- TikTok (video metadata)
- Instagram (posts)
- Twitter/X (tweets)
- Reddit (posts/comments)
- Generic web pages

### Extraction Process

```javascript
1. Detect platform
2. Fetch content (link-preview-js)
3. Extract text/metadata
4. Analyze content
5. Return results
```

## Security Measures

### Input Validation

- Max text length: 50,000 characters
- Max file size: 10MB
- Allowed file types: JPEG, PNG, GIF, WebP
- URL validation

### Rate Limiting

```javascript
// 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

### CORS

```javascript
cors({
  origin: process.env.CLIENT_URL,
  credentials: true
});
```

### Security Headers

- Helmet.js protection
- XSS prevention
- CSRF protection
- Content Security Policy

## Error Handling

### Global Error Handler

```javascript
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.statusCode || 500).json({
    error: err.message,
    ...(isDevelopment && { stack: err.stack })
  });
});
```

### Fallback Mechanisms

- AI API fails → Rule-based analysis
- OCR fails → Vision-only analysis
- Database fails → Continue without persistence

## Logging

### Winston Logger

```javascript
logger.info('Request processed');
logger.error('Error occurred', { error });
logger.warn('Rate limit approaching');
```

### Log Files

- `logs/combined.log` - All logs
- `logs/error.log` - Errors only

## Performance Optimization

### Caching Strategy

1. **AI Response Cache** (Redis)
   - Cache identical content analysis
   - TTL: 1 hour

2. **Static Asset Cache**
   - Browser cache: 1 year
   - CDN integration ready

### Image Optimization

- Automatic resizing
- Format conversion
- Quality optimization
- Progressive loading

### Code Splitting

```javascript
// React lazy loading
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
```

## Testing

### Unit Tests (Jest)

```bash
npm test
```

### API Tests (Supertest)

```javascript
describe('POST /api/analyze/text', () => {
  it('should analyze text and return threat score', async () => {
    const response = await request(app)
      .post('/api/analyze/text')
      .send({ text: 'Test content' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('threatScore');
  });
});
```

### Integration Tests

- Full analysis pipeline
- Multi-modal content
- Error scenarios

## Monitoring & Analytics

### Metrics Tracked

- Total analyses
- Category distribution
- Threat score distribution
- Response times
- Error rates

### Health Monitoring

```bash
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

## Future Enhancements

### Planned Features

1. **Real-time Analysis**
   - WebSocket support
   - Live content monitoring

2. **Advanced ML Models**
   - Custom fine-tuned models
   - Improved accuracy

3. **Multi-language Support**
   - i18n implementation
   - Language detection

4. **User Accounts**
   - Analysis history
   - Saved content
   - Custom alerts

5. **API Access**
   - Public API
   - Rate-limited tiers
   - API keys

6. **Mobile App**
   - React Native
   - Push notifications

7. **Browser Extension**
   - One-click analysis
   - Contextual scanning

## Contributing

See project README for contribution guidelines.

## License

MIT License - See LICENSE file
