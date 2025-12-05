#!/bin/bash

# ESafety Threat Detection - Video Tools Installation Script
# This script installs optional tools for enhanced video analysis

echo "=================================================="
echo "ESafety Threat Detection - Video Tools Installer"
echo "=================================================="
echo ""

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
fi

echo "Detected OS: $OS"
echo ""

# Check Python
echo "Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
    echo "✓ Python 3 found: $(python3 --version)"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    PIP_CMD="pip"
    echo "✓ Python found: $(python --version)"
else
    echo "✗ Python not found!"
    echo "Please install Python 3.7+ from https://www.python.org/downloads/"
    exit 1
fi

echo ""
echo "=================================================="
echo "Installing Video Analysis Tools"
echo "=================================================="
echo ""

# Install instaloader
echo "1. Installing instaloader (for Instagram Reels)..."
if $PIP_CMD install instaloader; then
    echo "✓ instaloader installed successfully"
else
    echo "✗ Failed to install instaloader"
    echo "  Try manually: $PIP_CMD install instaloader"
fi

echo ""

# Install yt-dlp
echo "2. Installing yt-dlp (for TikTok videos)..."

if [[ "$OS" == "mac" ]] && command -v brew &> /dev/null; then
    echo "  Using Homebrew..."
    if brew install yt-dlp; then
        echo "✓ yt-dlp installed successfully via Homebrew"
    else
        echo "  Homebrew failed, trying pip..."
        if $PIP_CMD install yt-dlp; then
            echo "✓ yt-dlp installed successfully via pip"
        else
            echo "✗ Failed to install yt-dlp"
        fi
    fi
else
    if $PIP_CMD install yt-dlp; then
        echo "✓ yt-dlp installed successfully"
    else
        echo "✗ Failed to install yt-dlp"
        echo "  Try manually: $PIP_CMD install yt-dlp"
        echo "  Or download from: https://github.com/yt-dlp/yt-dlp/releases"
    fi
fi

echo ""
echo "=================================================="
echo "Verifying Installation"
echo "=================================================="
echo ""

# Verify instaloader
if command -v instaloader &> /dev/null; then
    echo "✓ instaloader: $(instaloader --version)"
else
    echo "✗ instaloader: Not found"
fi

# Verify yt-dlp
if command -v yt-dlp &> /dev/null; then
    echo "✓ yt-dlp: $(yt-dlp --version)"
else
    echo "✗ yt-dlp: Not found"
fi

echo ""
echo "=================================================="
echo "Installation Complete!"
echo "=================================================="
echo ""
echo "What's installed:"
echo "  • instaloader - Instagram Reel caption extraction"
echo "  • yt-dlp      - TikTok video metadata extraction"
echo ""
echo "YouTube transcripts work automatically (no setup needed)!"
echo ""
echo "Next steps:"
echo "  1. Restart your application: npm run dev"
echo "  2. Test with a YouTube Short, Instagram Reel, or TikTok URL"
echo "  3. See VIDEO_DOWNLOAD_SETUP.md for more info"
echo ""
echo "Optional:"
echo "  • Get YouTube API key for comment analysis"
echo "  • Add YOUTUBE_API_KEY to your .env file"
echo ""
echo "Happy analyzing! 🚀"
