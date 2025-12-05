# Quick Start: Video Analysis

## Already Working! ✅

Your application now supports enhanced video analysis for:
- **YouTube** videos and Shorts (with transcripts!)
- **Instagram** Reels and Posts
- **TikTok** videos

## How to Use

### 1. Basic Mode (Works Now)

Just paste any video URL in the app:

```
https://www.youtube.com/shorts/abc123
https://www.instagram.com/reel/xyz789/
https://www.tiktok.com/@user/video/123456
```

The app will automatically extract and analyze:
- Titles and descriptions
- Available metadata
- Visual content context

### 2. Enhanced Mode (Optional Setup)

For **full transcripts** and **detailed captions**, install these tools:

#### For Instagram Reels:
```bash
pip install instaloader
```

#### For TikTok Videos:
```bash
pip install yt-dlp
```

**That's it!** The app will automatically detect and use these tools when available.

## Installation Commands

**Windows:**
```bash
# Run these in Command Prompt or PowerShell
pip install instaloader
pip install yt-dlp
```

**macOS:**
```bash
pip3 install instaloader
brew install yt-dlp
```

**Linux:**
```bash
pip3 install instaloader
pip3 install yt-dlp
```

## Verify Installation

```bash
instaloader --version
yt-dlp --version
```

If both commands work, you're all set!

## Testing

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npm run dev
   ```

3. **Try a YouTube Short:**
   - Go to http://localhost:3000
   - Click "URL/Link" tab
   - Paste a YouTube Shorts URL
   - Click "Analyze URL"
   - You should see transcript in the results!

## What You Get

### YouTube & Shorts
**Basic Mode:**
- Title, description, views

**Enhanced Mode:**
- ✅ **Full video transcript**
- ✅ Video metadata
- ✅ Author information

### Instagram Reels
**Basic Mode:**
- Post preview

**Enhanced Mode (with instaloader):**
- ✅ **Full caption text**
- ✅ Hashtags
- ✅ Post metadata

### TikTok
**Basic Mode:**
- Basic preview

**Enhanced Mode (with yt-dlp):**
- ✅ **Full description**
- ✅ Like/view counts
- ✅ Author info

## No Setup? No Problem!

The app works immediately with basic mode. Enhanced features are optional but provide much richer analysis with transcripts and captions.

## Need Help?

See [VIDEO_DOWNLOAD_SETUP.md](VIDEO_DOWNLOAD_SETUP.md) for detailed setup and troubleshooting.

## Example URLs to Test

**YouTube Shorts:**
```
https://www.youtube.com/shorts/[VIDEO_ID]
```

**Instagram Reels:**
```
https://www.instagram.com/reel/[REEL_ID]/
```

**TikTok:**
```
https://www.tiktok.com/@username/video/[VIDEO_ID]
```

Just paste any of these in your app and watch the AI analyze them! 🚀
