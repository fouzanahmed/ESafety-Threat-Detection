# Video Download Setup Guide

This guide explains how to set up enhanced video analysis features for YouTube Shorts, Instagram Reels, and TikTok videos.

## Overview

The application now supports **two modes** for video analysis:

1. **Basic Mode** (Works immediately, no setup required)
   - Uses metadata and previews
   - Limited information
   - No transcripts

2. **Enhanced Mode** (Requires additional tools)
   - Downloads video transcripts
   - Extracts captions and comments
   - Full content analysis

## Quick Start (Basic Mode)

The application works out of the box with basic video analysis. Just paste any video URL!

**Supported:**
- YouTube videos
- YouTube Shorts
- Instagram Reels (limited)
- TikTok videos (limited)

## Enhanced Mode Setup

For full video analysis with transcripts and captions, install these tools:

### YouTube Support (Transcripts & Comments)

The YouTube transcript feature works automatically with the installed npm packages!

**Optional: Get YouTube API Key for comments**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add to `.env`:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

### Instagram Support (Reels & Posts)

**Install instaloader:**

```bash
# Windows
pip install instaloader

# macOS/Linux
pip3 install instaloader
```

**Verify installation:**
```bash
instaloader --version
```

### TikTok Support (Videos)

**Install yt-dlp:**

**Windows:**
```bash
# Using pip
pip install yt-dlp

# Or download exe from GitHub
# https://github.com/yt-dlp/yt-dlp/releases
```

**macOS:**
```bash
brew install yt-dlp
```

**Linux:**
```bash
# Using pip
pip3 install yt-dlp

# Or using package manager
sudo apt install yt-dlp  # Debian/Ubuntu
```

**Verify installation:**
```bash
yt-dlp --version
```

## Checking Your Setup

Run this command to check what features are available:

```bash
# Check Python packages
pip list | grep -E "instaloader|yt-dlp"

# Check if commands work
instaloader --version
yt-dlp --version
```

## Features by Platform

### YouTube & YouTube Shorts

**Basic Mode:**
- ✅ Title and description
- ✅ View count
- ✅ Video metadata

**Enhanced Mode:**
- ✅ Everything in Basic
- ✅ **Video transcripts** (automatic captions)
- ✅ **Top comments** (with YouTube API key)
- ✅ Duration and author info

**Example URLs:**
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/shorts/SHORT_ID
```

### Instagram Reels & Posts

**Basic Mode:**
- ✅ Post preview
- ⚠️ Limited caption access

**Enhanced Mode (with instaloader):**
- ✅ Full caption text
- ✅ Post metadata
- ✅ Hashtags and mentions

**Example URLs:**
```
https://www.instagram.com/reel/REEL_ID/
https://www.instagram.com/p/POST_ID/
```

**Note:** Instagram may require authentication for some content. The app will fall back to basic mode if needed.

### TikTok

**Basic Mode:**
- ✅ Video preview
- ⚠️ Limited metadata

**Enhanced Mode (with yt-dlp):**
- ✅ Full description
- ✅ Like/view counts
- ✅ Author information
- ✅ Video metadata

**Example URLs:**
```
https://www.tiktok.com/@user/video/VIDEO_ID
https://vm.tiktok.com/SHORT_ID
```

## Environment Variables

Add these to your `.env` file for enhanced features:

```env
# Optional: YouTube Data API (for comments)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Optional: Temp directory for downloads
TEMP_DIR=./temp
```

## How It Works

1. **URL Submitted** → Application detects platform
2. **Enhanced Extraction Attempted:**
   - YouTube: Transcript extraction via `youtube-transcript`
   - Instagram: Caption download via `instaloader`
   - TikTok: Metadata extraction via `yt-dlp`
3. **Fallback to Basic:** If enhanced fails, uses basic preview method
4. **Analysis:** All extracted content (transcript, captions, comments) is analyzed by AI

## Troubleshooting

### "Enhanced extraction failed, falling back to basic method"

This message means enhanced tools aren't available. The app still works with basic analysis!

**To enable enhanced mode:**
- Install the appropriate tool (see setup above)
- Restart the application

### YouTube Transcripts Not Working

**Possible issues:**
- Video has no captions/transcripts
- Video is private or age-restricted
- Temporary YouTube API issues

**Solution:** The app will still analyze title and description.

### Instagram Content Not Accessible

**Possible issues:**
- Private account
- Login required content
- Instagram rate limiting

**Solution:**
- Use instaloader with authentication (advanced)
- Use basic mode with public posts

### TikTok Extraction Fails

**Possible issues:**
- TikTok blocks automated access
- yt-dlp needs update
- Region restrictions

**Solution:**
```bash
# Update yt-dlp
pip install --upgrade yt-dlp
```

### Permission Errors

**Windows:** Run terminal as Administrator
**macOS/Linux:** Use `sudo` for installation

## Testing Your Setup

### Test YouTube (with transcript)

```bash
curl -X POST http://localhost:5000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Look for `"hasTranscript": true` in the response.

### Test Instagram Reel

```bash
curl -X POST http://localhost:5000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.instagram.com/reel/EXAMPLE/"}'
```

### Test TikTok

```bash
curl -X POST http://localhost:5000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.tiktok.com/@user/video/123456789"}'
```

## Performance Notes

**Enhanced mode is slower:**
- YouTube transcript: +2-5 seconds
- Instagram with instaloader: +5-10 seconds
- TikTok with yt-dlp: +3-7 seconds

**Recommendations:**
- Use enhanced mode for detailed analysis
- Basic mode is fine for quick checks
- Consider caching frequently analyzed content

## Rate Limits

**YouTube API:**
- Free tier: 10,000 quota/day
- Each comment request: 1-5 quota

**Instagram/TikTok:**
- No official API used
- Rate limiting by platform may occur
- Implement delays for bulk analysis

## Privacy & Legal

**Important:**
- Only analyze public content
- Respect platform Terms of Service
- Don't download copyrighted content
- Use for safety analysis only

**The tools:**
- `youtube-transcript`: Accesses public captions
- `instaloader`: Downloads public posts
- `yt-dlp`: Extracts public metadata

## Advanced Configuration

### Custom Temp Directory

```env
TEMP_DIR=/custom/temp/path
```

### Cleanup Old Files

Old temporary files are automatically cleaned up after 1 hour.

Manual cleanup:
```bash
rm -rf temp/*
```

### Disable Enhanced Features

To force basic mode only, don't install the tools. The app will automatically use fallback methods.

## Getting Help

**Issues with:**
- YouTube transcripts: Check if video has captions enabled
- Instagram: Try with instaloader directly first
- TikTok: Update yt-dlp to latest version

**Still not working?**
- Check the logs in `logs/combined.log`
- Verify tools are in PATH
- Restart the application after installing tools

## Summary

| Feature | Required | Purpose |
|---------|----------|---------|
| Basic Mode | None | Title/description analysis |
| YouTube Transcripts | npm packages ✅ | Full video content |
| YouTube Comments | YouTube API Key | Comment analysis |
| Instagram Reels | instaloader | Full caption access |
| TikTok Videos | yt-dlp | Complete metadata |

**Recommended Setup:**
1. Start with basic mode (works immediately)
2. Add `instaloader` for Instagram
3. Add `yt-dlp` for TikTok
4. Add YouTube API key if you need comments

Your application will automatically use the best available method for each platform!
