# Windows Setup Guide

## Video Analysis Tools - Windows Specific

If you're on Windows and the tools don't work directly from command line, **don't worry!** The application automatically handles this.

## Your Current Status ✅

Both tools are already installed and working:
- ✅ `instaloader` version 4.15
- ✅ `yt-dlp` version 2025.11.12

## How It Works on Windows

The app automatically tries both methods:
1. Direct command (e.g., `instaloader --version`)
2. Python module (e.g., `python -m instaloader --version`)

**You don't need to do anything!** The app handles Windows PATH issues automatically.

## Quick Test

Open PowerShell or Command Prompt and run:

```bash
# Test instaloader
python -m instaloader --version

# Test yt-dlp
python -m yt_dlp --version
```

If both show version numbers, you're all set! ✅

## Running the App

```bash
# Navigate to your project
cd "C:\Users\91967\OneDrive\Desktop\Hacxkathon\ESafety-Threat-Detection"

# Start the app
npm run dev
```

## Testing Video Analysis

1. App starts at http://localhost:3000
2. Click "URL/Link" tab
3. Try these:

**YouTube Short:**
```
https://www.youtube.com/shorts/[VIDEO_ID]
```

**Instagram Reel:**
```
https://www.instagram.com/reel/[REEL_ID]/
```

**TikTok:**
```
https://www.tiktok.com/@user/video/[VIDEO_ID]
```

## Common Windows Issues (Already Fixed!)

### ❌ "is not recognized as an internal or external command"

**Problem:** Python packages not in PATH

**Solution:** Already fixed! App uses `python -m` method automatically

### ❌ "Permission denied" or "Access denied"

**Problem:** Antivirus blocking execution

**Solution:**
- Add project folder to antivirus exceptions
- Or run PowerShell as Administrator

### ❌ Python not found

**Solution:**
1. Install Python from https://www.python.org/downloads/
2. ✅ **Check "Add Python to PATH"** during installation
3. Restart Command Prompt/PowerShell

## Optional: Add to PATH (Not Required)

If you want commands to work directly:

1. Find your Python Scripts folder:
   ```
   C:\Users\[YourName]\AppData\Roaming\Python\Python313\Scripts
   ```

2. Add to PATH:
   - Open Settings → System → About
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Edit "Path" under "User variables"
   - Add your Scripts folder path
   - Click OK

3. Restart Command Prompt/PowerShell

4. Test:
   ```bash
   instaloader --version
   yt-dlp --version
   ```

**But remember:** This is optional! The app already works without it.

## Verifying Everything Works

Run this test:

```bash
cd "C:\Users\91967\OneDrive\Desktop\Hacxkathon\ESafety-Threat-Detection"

node -e "const vds = require('./server/services/videoDownloadService'); (async () => { console.log('Instaloader:', await vds.checkInstaloader()); console.log('yt-dlp:', await vds.checkYtDlp()); })()"
```

Expected output:
```
Instaloader: true
yt-dlp: true
```

If both are `true`, everything is working! ✅

## Your Setup Summary

✅ Node.js installed
✅ Python installed
✅ npm packages installed
✅ instaloader installed (via pip)
✅ yt-dlp installed (via pip)
✅ App configured to use Python modules
✅ Windows PATH issues handled automatically

**You're ready to go!** 🚀

## Start Analyzing

```bash
npm run dev
```

Then open http://localhost:3000 and start analyzing videos!

## Need Help?

Check these files:
- `VIDEO_FEATURES_SUMMARY.md` - Complete feature overview
- `VIDEO_DOWNLOAD_SETUP.md` - Detailed setup guide
- `QUICK_START_VIDEO.md` - Quick reference

Or check the logs:
```
logs/combined.log
logs/error.log
```

## Support

Everything should work automatically on Windows now. If you have issues:

1. Check Python is installed: `python --version`
2. Check pip works: `pip --version`
3. Reinstall packages: `pip install --upgrade instaloader yt-dlp`
4. Check the logs for specific errors

Your app is fully configured for Windows! 🎉
