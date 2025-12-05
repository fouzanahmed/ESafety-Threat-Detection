const ytdl = require('@distube/ytdl-core');
const { YoutubeTranscript } = require('youtube-transcript');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const logger = require('../utils/logger');
const videoFrameExtractionService = require('./videoFrameExtractionService');

const execAsync = promisify(exec);

class VideoDownloadService {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    await fs.ensureDir(this.tempDir);
  }

  /**
   * Main method to download and extract content from video URLs
   */
  async downloadAndAnalyze(url) {
    try {
      const platform = this.detectPlatform(url);
      logger.info(`Detected platform: ${platform} for URL: ${url}`);

      switch (platform) {
        case 'youtube':
        case 'youtube-shorts':
          return await this.handleYouTube(url);
        case 'instagram':
          return await this.handleInstagram(url);
        case 'tiktok':
          return await this.handleTikTok(url);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      logger.error('Video download error:', error);
      throw error;
    }
  }

  /**
   * Detect platform from URL
   */
  detectPlatform(url) {
    const urlLower = url.toLowerCase();

    if (urlLower.includes('youtube.com/shorts') || urlLower.includes('youtu.be')) {
      return 'youtube-shorts';
    }
    if (urlLower.includes('youtube.com')) {
      return 'youtube';
    }
    if (urlLower.includes('instagram.com/reel') || urlLower.includes('instagram.com/p')) {
      return 'instagram';
    }
    if (urlLower.includes('tiktok.com')) {
      return 'tiktok';
    }

    return 'unknown';
  }

  /**
   * Handle YouTube videos and shorts
   */
  async handleYouTube(url) {
    try {
      const videoId = this.extractYouTubeId(url);

      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      logger.info(`Processing YouTube video: ${videoId}`);

      // Get video info
      const info = await ytdl.getInfo(videoId);
      const videoDetails = info.videoDetails;

      // Try to get transcript
      let transcript = null;
      try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        transcript = transcriptData.map(item => item.text).join(' ');
        logger.info('Successfully extracted transcript');
      } catch (transcriptError) {
        logger.warn('No transcript available:', transcriptError.message);
      }

      // Get comments if available
      let comments = [];
      try {
        comments = await this.getYouTubeComments(videoId);
      } catch (commentError) {
        logger.warn('Could not fetch comments:', commentError.message);
      }

      return {
        platform: 'youtube',
        videoId: videoId,
        title: videoDetails.title,
        description: videoDetails.description,
        author: videoDetails.author.name,
        views: parseInt(videoDetails.viewCount) || 0,
        duration: parseInt(videoDetails.lengthSeconds) || 0,
        transcript: transcript,
        comments: comments.slice(0, 20), // Top 20 comments
        thumbnailUrl: videoDetails.thumbnails?.[0]?.url,
        hasTranscript: !!transcript,
        url: url
      };
    } catch (error) {
      logger.error('YouTube handling error:', error);
      throw new Error(`Failed to process YouTube video: ${error.message}`);
    }
  }

  /**
   * Extract YouTube video ID from various URL formats
   */
  extractYouTubeId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Get YouTube comments (simplified - in production use YouTube Data API)
   */
  async getYouTubeComments(videoId) {
    // Note: This requires YouTube Data API key
    // For now, return empty array
    // In production, implement with: https://developers.google.com/youtube/v3/docs/commentThreads/list

    if (process.env.YOUTUBE_API_KEY) {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/commentThreads`,
          {
            params: {
              part: 'snippet',
              videoId: videoId,
              maxResults: 20,
              order: 'relevance',
              key: process.env.YOUTUBE_API_KEY
            }
          }
        );

        return response.data.items.map(item =>
          item.snippet.topLevelComment.snippet.textDisplay
        );
      } catch (error) {
        logger.warn('YouTube API error:', error.message);
        return [];
      }
    }

    return [];
  }

  /**
   * Handle Instagram Reels and Posts
   */
  async handleInstagram(url) {
    try {
      logger.info('Processing Instagram content:', url);

      // Check if it's a reel
      const isReel = url.includes('/reel/');

      // Check if instaloader is installed
      const hasInstaloader = await this.checkInstaloader();

      if (hasInstaloader) {
        if (isReel) {
          // Use enhanced frame extraction for reels
          return await this.handleInstagramReelWithFrames(url);
        } else {
          return await this.handleInstagramWithInstaloader(url);
        }
      } else {
        return await this.handleInstagramFallback(url);
      }
    } catch (error) {
      logger.error('Instagram handling error:', error);
      throw new Error(`Failed to process Instagram content: ${error.message}`);
    }
  }

  /**
   * Enhanced Instagram Reel handling with frame extraction
   */
  async handleInstagramReelWithFrames(url) {
    try {
      const shortcode = this.extractInstagramShortcode(url);
      logger.info(`Processing Instagram reel with frame extraction: ${shortcode}`);

      // Use frame extraction service
      const reelData = await videoFrameExtractionService.processInstagramReel(url);

      if (!reelData.success) {
        logger.warn('Frame extraction failed, falling back to standard method');
        return await this.handleInstagramWithInstaloader(url);
      }

      // Build description from frames and transcription
      let description = `Instagram Reel (${shortcode})\n\n`;

      if (reelData.hasFrames && reelData.frames.length > 0) {
        description += `Video Duration: ${reelData.duration?.toFixed(2) || 'unknown'} seconds\n`;
        description += `Frames extracted: ${reelData.frames.length}\n\n`;

        // Analyze frames using AI (frames can be sent to image analysis)
        description += 'Visual content analysis from key frames:\n';
        description += `- First frame: Beginning of video\n`;
        if (reelData.frames.length > 1) {
          description += `- Middle frame: Midpoint of video\n`;
        }
        if (reelData.frames.length > 2) {
          description += `- Last frame: End of video\n`;
        }
      }

      if (reelData.transcription) {
        description += `\n\nAudio Transcription:\n${reelData.transcription}`;
      } else {
        description += '\n\nNote: Video transcription requires speech-to-text integration';
      }

      // Clean up frames after analysis (optional - keep for debugging)
      if (reelData.framesDir) {
        setTimeout(() => {
          videoFrameExtractionService.cleanup(reelData.framesDir);
        }, 60000); // Clean up after 1 minute
      }

      return {
        platform: 'instagram-reel',
        shortcode: shortcode,
        caption: description,
        frames: reelData.frames,
        duration: reelData.duration,
        hasTranscription: !!reelData.transcription,
        transcription: reelData.transcription,
        url: url,
        downloadMethod: 'enhanced-frame-extraction'
      };
    } catch (error) {
      logger.error('Enhanced reel processing error:', error);
      // Fallback to standard method
      return await this.handleInstagramWithInstaloader(url);
    }
  }

  /**
   * Check if instaloader is installed
   */
  async checkInstaloader() {
    try {
      // Try direct command first
      await execAsync('instaloader --version');
      return true;
    } catch (error) {
      // Try as Python module (Windows often needs this)
      try {
        await execAsync('python -m instaloader --version');
        return true;
      } catch (moduleError) {
        logger.warn('Instaloader not installed. Install with: pip install instaloader');
        return false;
      }
    }
  }

  /**
   * Use instaloader to download Instagram content
   */
  async handleInstagramWithInstaloader(url) {
    const shortcode = this.extractInstagramShortcode(url);
    const outputDir = path.join(this.tempDir, `instagram_${shortcode}`);

    try {
      await fs.ensureDir(outputDir);

      // Download post with instaloader
      // Try direct command first, fallback to python module
      let command = `instaloader --no-profile-pic --no-metadata-json --dirname-pattern="${outputDir}" -- -${shortcode}`;

      logger.info('Executing instaloader command...');

      let stdout, stderr;
      try {
        const result = await execAsync(command, {
          timeout: 30000 // 30 second timeout
        });
        stdout = result.stdout;
        stderr = result.stderr;
      } catch (cmdError) {
        // Try as Python module (Windows PATH issue)
        logger.info('Retrying with python -m instaloader...');
        command = `python -m instaloader --no-profile-pic --no-metadata-json --dirname-pattern="${outputDir}" -- -${shortcode}`;
        const result = await execAsync(command, {
          timeout: 30000
        });
        stdout = result.stdout;
        stderr = result.stderr;
      }

      logger.info('Instaloader output:', stdout);

      // Read caption from file if available
      const captionFile = path.join(outputDir, `*${shortcode}*.txt`);
      const captionFiles = await fs.readdir(outputDir).then(files =>
        files.filter(f => f.includes(shortcode) && f.endsWith('.txt'))
      );

      let caption = '';
      if (captionFiles.length > 0) {
        caption = await fs.readFile(
          path.join(outputDir, captionFiles[0]),
          'utf-8'
        );
      }

      // Clean up downloaded files
      await fs.remove(outputDir);

      return {
        platform: 'instagram',
        shortcode: shortcode,
        caption: caption,
        url: url,
        downloadMethod: 'instaloader'
      };
    } catch (error) {
      logger.error('Instaloader error:', error);
      // Fallback to API method
      return await this.handleInstagramFallback(url);
    } finally {
      // Cleanup
      try {
        await fs.remove(outputDir);
      } catch (e) {
        logger.warn('Cleanup error:', e.message);
      }
    }
  }

  /**
   * Fallback Instagram handler using public API endpoints
   */
  async handleInstagramFallback(url) {
    const shortcode = this.extractInstagramShortcode(url);

    try {
      // Try to fetch public data
      const apiUrl = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;

      const response = await axios.get(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const data = response.data;
      const mediaData = data?.items?.[0] || data?.graphql?.shortcode_media;

      if (mediaData) {
        return {
          platform: 'instagram',
          shortcode: shortcode,
          caption: mediaData.caption?.text || mediaData.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          likes: mediaData.like_count || 0,
          comments: mediaData.comment_count || 0,
          url: url,
          downloadMethod: 'api-fallback'
        };
      }

      throw new Error('Could not extract Instagram data');
    } catch (error) {
      logger.error('Instagram API fallback error:', error);

      // Last resort: basic scraping
      return {
        platform: 'instagram',
        shortcode: shortcode,
        caption: 'Unable to extract caption. Instagram content requires authentication.',
        url: url,
        downloadMethod: 'failed',
        note: 'Install instaloader for better Instagram support: pip install instaloader'
      };
    }
  }

  /**
   * Extract Instagram shortcode from URL
   */
  extractInstagramShortcode(url) {
    const match = url.match(/(?:\/p\/|\/reel\/)([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }

  /**
   * Handle TikTok videos
   */
  async handleTikTok(url) {
    try {
      logger.info('Processing TikTok content:', url);

      // Check if yt-dlp is installed
      const hasYtDlp = await this.checkYtDlp();

      if (hasYtDlp) {
        return await this.handleTikTokWithYtDlp(url);
      } else {
        return await this.handleTikTokFallback(url);
      }
    } catch (error) {
      logger.error('TikTok handling error:', error);
      throw new Error(`Failed to process TikTok content: ${error.message}`);
    }
  }

  /**
   * Check if yt-dlp is installed
   */
  async checkYtDlp() {
    try {
      // Try direct command first
      await execAsync('yt-dlp --version');
      return true;
    } catch (error) {
      // Try as Python module (Windows often needs this)
      try {
        await execAsync('python -m yt_dlp --version');
        return true;
      } catch (moduleError) {
        logger.warn('yt-dlp not installed. Install from: https://github.com/yt-dlp/yt-dlp');
        return false;
      }
    }
  }

  /**
   * Use yt-dlp to extract TikTok metadata
   */
  async handleTikTokWithYtDlp(url) {
    try {
      // Extract metadata only (no download)
      let command = `yt-dlp --skip-download --print-json "${url}"`;

      let stdout;
      try {
        const result = await execAsync(command, {
          timeout: 20000,
          maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        });
        stdout = result.stdout;
      } catch (cmdError) {
        // Try as Python module (Windows PATH issue)
        logger.info('Retrying with python -m yt_dlp...');
        command = `python -m yt_dlp --skip-download --print-json "${url}"`;
        const result = await execAsync(command, {
          timeout: 20000,
          maxBuffer: 1024 * 1024 * 10
        });
        stdout = result.stdout;
      }

      const metadata = JSON.parse(stdout);

      return {
        platform: 'tiktok',
        id: metadata.id,
        title: metadata.title || metadata.description,
        description: metadata.description,
        author: metadata.uploader || metadata.creator,
        likes: metadata.like_count || 0,
        views: metadata.view_count || 0,
        comments: metadata.comment_count || 0,
        duration: metadata.duration,
        url: url,
        downloadMethod: 'yt-dlp'
      };
    } catch (error) {
      logger.error('yt-dlp error:', error);
      return await this.handleTikTokFallback(url);
    }
  }

  /**
   * Fallback TikTok handler
   */
  async handleTikTokFallback(url) {
    try {
      // Basic metadata extraction without downloading
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      // Basic scraping (very limited)
      return {
        platform: 'tiktok',
        url: url,
        note: 'Limited TikTok support without yt-dlp. Install yt-dlp for full functionality.',
        downloadMethod: 'fallback'
      };
    } catch (error) {
      logger.error('TikTok fallback error:', error);
      throw new Error('Unable to process TikTok content. Install yt-dlp for support.');
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanup() {
    try {
      const files = await fs.readdir(this.tempDir);
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hour

      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs > maxAge) {
          await fs.remove(filePath);
          logger.info(`Cleaned up old file: ${file}`);
        }
      }
    } catch (error) {
      logger.error('Cleanup error:', error);
    }
  }
}

module.exports = new VideoDownloadService();
