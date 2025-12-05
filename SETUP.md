# ESafety Threat Detection - Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your AI API key:

```env
# Choose ONE of these AI providers:

# Option 1: OpenAI (Recommended)
OPENAI_API_KEY=sk-your-openai-key-here

# Option 2: Google AI (Alternative)
GOOGLE_AI_API_KEY=your-google-ai-key-here
```

**Getting API Keys:**

- **OpenAI**: Visit https://platform.openai.com/api-keys
- **Google AI**: Visit https://makersuite.google.com/app/apikey

### Step 3: Start the Application

```bash
# Start both backend and frontend
npm run dev
```

That's it! The application will open at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Detailed Setup

### Prerequisites

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **AI API Key** (OpenAI or Google AI)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ESafety-Threat-Detection.git
cd ESafety-Threat-Detection
```

#### 2. Install All Dependencies

```bash
npm run install-all
```

This installs dependencies for both backend and frontend.

#### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# AI Provider (choose one)
OPENAI_API_KEY=your_key_here
# OR
GOOGLE_AI_API_KEY=your_key_here

# Optional: Database (for analytics)
MONGODB_URI=mongodb://localhost:27017/esafety-threat-detection

# Optional: Cache
REDIS_URL=redis://localhost:6379
ENABLE_CACHE=false

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# File Upload Limits
MAX_FILE_SIZE=10485760
```

#### 4. Start Development Servers

```bash
# Start both backend and frontend
npm run dev
```

Or start them separately:

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client
```

#### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Project Structure

```
ESafety-Threat-Detection/
├── server/              # Backend Express API
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI, NLP)
│   ├── models/          # Database models
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utilities (logger)
│   └── data/            # Static data (resources)
├── client/              # Frontend React app
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       └── services/    # API client
├── logs/                # Application logs (auto-created)
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## Testing the Application

### 1. Text Analysis

1. Go to http://localhost:3000
2. Click the "Text" tab
3. Paste this test content:
   ```
   This is a safe message about having a good day.
   ```
4. Click "Analyze Text"
5. View the results

### 2. Image Analysis

1. Click the "Image" tab
2. Upload a screenshot or image
3. Click "Analyze Image"
4. View the results

### 3. URL Analysis

1. Click the "URL/Link" tab
2. Paste a YouTube or social media link
3. Click "Analyze URL"
4. View the results

## Troubleshooting

### Backend won't start

**Error**: `Cannot find module`
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

**Error**: `Port 5000 already in use`
```bash
# Solution: Change port in .env
PORT=5001
```

**Error**: `Missing API key`
```bash
# Solution: Add API key to .env
OPENAI_API_KEY=your_key_here
```

### Frontend won't start

**Error**: `Cannot connect to backend`
```bash
# Solution: Check backend is running
curl http://localhost:5000/health
```

**Error**: `Module not found`
```bash
# Solution: Reinstall frontend dependencies
cd client
rm -rf node_modules
npm install
```

### API Analysis Fails

**Error**: `AI analysis failed`
- Check your API key is valid
- Verify you have credits/quota
- Check internet connection
- Try the fallback mode (works without AI)

## Optional Features

### MongoDB (Analytics)

Install MongoDB for optional analytics:

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Download from https://www.mongodb.com/try/download/community

Update `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/esafety-threat-detection
```

### Redis (Caching)

Install Redis for optional caching:

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

Update `.env`:
```env
REDIS_URL=redis://localhost:6379
ENABLE_CACHE=true
```

## Production Build

### Build Frontend

```bash
cd client
npm run build
```

The optimized production build will be in `client/build/`.

### Start Production Server

```bash
NODE_ENV=production npm start
```

## Docker Deployment

### Quick Start

```bash
# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up -d
```

### Custom Configuration

Edit `docker-compose.yml` and `.env`, then:

```bash
docker-compose build
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f
```

### Stop Services

```bash
docker-compose down
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Backend server port |
| `NODE_ENV` | No | development | Environment mode |
| `OPENAI_API_KEY` | Yes* | - | OpenAI API key |
| `GOOGLE_AI_API_KEY` | Yes* | - | Google AI API key |
| `MONGODB_URI` | No | - | MongoDB connection string |
| `REDIS_URL` | No | - | Redis connection string |
| `CLIENT_URL` | No | http://localhost:3000 | Frontend URL |
| `MAX_FILE_SIZE` | No | 10485760 | Max upload size (bytes) |
| `RATE_LIMIT_WINDOW` | No | 15 | Rate limit window (minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | No | 100 | Max requests per window |

*At least one AI provider key is required

## Getting Help

- **Documentation**: See [README.md](README.md)
- **Technical Docs**: See [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: Create an issue on GitHub

## Next Steps

1. ✅ Application is running
2. Test all three analysis modes (Text, Image, URL)
3. Review the analysis results
4. Check out the Resources page
5. Read the About page
6. Deploy to production (see DEPLOYMENT.md)

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Backend: Nodemon watches for changes
- Frontend: React auto-reloads

### Debugging

Enable detailed logging:
```env
LOG_LEVEL=debug
```

### API Testing

Use curl or Postman:

```bash
# Health check
curl http://localhost:5000/health

# Analyze text
curl -X POST http://localhost:5000/api/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text":"Test content"}'
```

### Code Formatting

```bash
# Format code (if you have prettier installed)
npm run format
```

## Security Notes

- Never commit `.env` file
- Rotate API keys regularly
- Use HTTPS in production
- Enable rate limiting
- Monitor API usage

## Success!

Your ESafety Threat Detection application is now set up and running!

Visit http://localhost:3000 to start analyzing content.
