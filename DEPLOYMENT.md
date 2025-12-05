# Deployment Guide

This guide covers deploying ESafety Threat Detection to various platforms.

## Prerequisites

1. Node.js 18+ installed
2. MongoDB database (optional, for analytics)
3. AI API key (OpenAI or Google AI)

## Environment Variables

Create a `.env` file with:

```env
# Required
PORT=5000
OPENAI_API_KEY=your_key_here
# or
GOOGLE_AI_API_KEY=your_key_here

# Optional
MONGODB_URI=mongodb://localhost:27017/esafety-threat-detection
REDIS_URL=redis://localhost:6379
NODE_ENV=production
```

## Local Development

1. Install dependencies:
```bash
npm run install-all
```

2. Start development servers:
```bash
npm run dev
```

Backend: http://localhost:5000
Frontend: http://localhost:3000

## Docker Deployment

### Quick Start

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Start all services
docker-compose up -d
```

Access the application at http://localhost:3000

### Production Build

```bash
# Build images
docker-compose build

# Start in production mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Cloud Deployment

### Option 1: Heroku

#### Backend

```bash
# Login to Heroku
heroku login

# Create app
heroku create esafety-api

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Frontend

Deploy to Heroku or Netlify:

```bash
# Add API URL to frontend
echo "REACT_APP_API_URL=https://esafety-api.herokuapp.com/api" > client/.env.production

# Build
cd client && npm run build
```

### Option 2: Railway

1. Visit [Railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables
4. Deploy automatically

### Option 3: Render

1. Visit [Render.com](https://render.com)
2. Create Web Service from Git repository
3. Backend:
   - Build: `npm install`
   - Start: `node server/index.js`
4. Frontend:
   - Build: `cd client && npm install && npm run build`
   - Publish: `client/build`

### Option 4: Vercel (Frontend) + Railway (Backend)

#### Backend on Railway
1. Deploy backend to Railway
2. Get API URL

#### Frontend on Vercel
```bash
cd client
vercel --prod
# Set environment variable: REACT_APP_API_URL
```

### Option 5: AWS

#### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create esafety-production

# Deploy
eb deploy
```

#### Using ECS (Docker)

1. Push Docker images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Add to environment variables:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/esafety
```

### Local MongoDB

```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start service
mongod --dbpath /data/db
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (nginx, AWS ALB)
- Deploy multiple backend instances
- Share session state via Redis

### Caching

Add Redis for caching AI responses:

```javascript
// Example caching middleware
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache AI responses for 1 hour
await client.setex(`analysis:${hash}`, 3600, JSON.stringify(result));
```

### Rate Limiting

Already configured in server. Adjust in `.env`:

```env
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Monitoring

### Logs

Application logs are stored in `logs/` directory:
- `error.log` - Error logs only
- `combined.log` - All logs

### Health Check

Monitor endpoint: `GET /health`

Returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

### Analytics (Optional)

If MongoDB is connected, analytics are automatically collected:
- Analysis counts by category
- Threat score distributions
- Content type breakdowns

## Security Checklist

- [ ] Set strong `NODE_ENV=production`
- [ ] Use HTTPS in production
- [ ] Set secure CORS origins
- [ ] Rotate API keys regularly
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerts
- [ ] Regular dependency updates
- [ ] Database backups configured

## Troubleshooting

### Backend won't start
- Check `.env` file exists
- Verify API keys are valid
- Check port 5000 is available

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is set
- Check CORS configuration
- Verify backend is running

### AI analysis fails
- Check API key is valid
- Verify API quota/billing
- Check network connectivity

## Cost Optimization

### AI API Usage

- Implement caching for duplicate content
- Use cheaper models for simple analysis
- Batch requests when possible

Estimated costs (per 1000 analyses):
- OpenAI GPT-4: ~$1-3
- Google Gemini: ~$0.50-1.50
- Rule-based only: Free

### Infrastructure

- Start with small instances
- Use serverless (AWS Lambda, Vercel)
- Enable auto-scaling
- Monitor and optimize

## Support

For deployment issues:
1. Check logs in `logs/` directory
2. Review environment variables
3. Test health endpoint
4. Contact support with error details
