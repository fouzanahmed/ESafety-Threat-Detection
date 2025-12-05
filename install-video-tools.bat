@echo off
REM ESafety Threat Detection - Video Tools Installation Script for Windows
REM This script installs optional tools for enhanced video analysis

echo ==================================================
echo ESafety Threat Detection - Video Tools Installer
echo ==================================================
echo.

REM Check Python
echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [X] Python not found!
    echo Please install Python 3.7+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

python --version
echo [OK] Python found
echo.

echo ==================================================
echo Installing Video Analysis Tools
echo ==================================================
echo.

REM Install instaloader
echo 1. Installing instaloader (for Instagram Reels)...
pip install instaloader
if errorlevel 1 (
    echo [X] Failed to install instaloader
    echo Try manually: pip install instaloader
) else (
    echo [OK] instaloader installed successfully
)

echo.

REM Install yt-dlp
echo 2. Installing yt-dlp (for TikTok videos)...
pip install yt-dlp
if errorlevel 1 (
    echo [X] Failed to install yt-dlp
    echo Try manually: pip install yt-dlp
    echo Or download from: https://github.com/yt-dlp/yt-dlp/releases
) else (
    echo [OK] yt-dlp installed successfully
)

echo.
echo ==================================================
echo Verifying Installation
echo ==================================================
echo.

REM Verify instaloader
instaloader --version >nul 2>&1
if errorlevel 1 (
    echo [X] instaloader: Not found
) else (
    instaloader --version
    echo [OK] instaloader verified
)

REM Verify yt-dlp
yt-dlp --version >nul 2>&1
if errorlevel 1 (
    echo [X] yt-dlp: Not found
) else (
    yt-dlp --version
    echo [OK] yt-dlp verified
)

echo.
echo ==================================================
echo Installation Complete!
echo ==================================================
echo.
echo What's installed:
echo   - instaloader : Instagram Reel caption extraction
echo   - yt-dlp      : TikTok video metadata extraction
echo.
echo YouTube transcripts work automatically (no setup needed)!
echo.
echo Next steps:
echo   1. Restart your application: npm run dev
echo   2. Test with a YouTube Short, Instagram Reel, or TikTok URL
echo   3. See VIDEO_DOWNLOAD_SETUP.md for more info
echo.
echo Optional:
echo   - Get YouTube API key for comment analysis
echo   - Add YOUTUBE_API_KEY to your .env file
echo.
echo Happy analyzing!
echo.
pause
