const axios = require('axios');
const { getLinkPreview } = require('link-preview-js');
const logger = require('../utils/logger');
const videoDownloadService = require('./videoDownloadService');

class URLService {
  async extractContent(url) {
    try {
      const contentType = this.detectContentType(url);

      if (contentType === 'video') {
        return await this.extractVideoContent(url);
      } else if (contentType === 'social') {
        return await this.extractSocialContent(url);
      } else {
        return await this.extractWebContent(url);
      }
    } catch (error) {
      logger.error('Error extracting URL content:', error);
      throw new Error('Failed to extract content from URL');
    }
  }

  detectContentType(url) {
    const urlLower = url.toLowerCase();

    if (
      urlLower.includes('youtube.com') ||
      urlLower.includes('youtu.be') ||
      urlLower.includes('tiktok.com') ||
      urlLower.includes('instagram.com/reel') ||
      urlLower.includes('instagram.com/p') ||
      urlLower.includes('vimeo.com')
    ) {
      return 'video';
    }

    if (
      urlLower.includes('instagram.com') ||
      urlLower.includes('twitter.com') ||
      urlLower.includes('x.com') ||
      urlLower.includes('facebook.com') ||
      urlLower.includes('reddit.com')
    ) {
      return 'social';
    }

    return 'web';
  }

  async extractVideoContent(url) {
    try {
      // Try enhanced video download service first
      logger.info('Attempting enhanced video extraction with download service...');

      try {
        const videoData = await videoDownloadService.downloadAndAnalyze(url);

        // Convert to standard format
        let text = '';

        if (videoData.transcript) {
          text += `Transcript: ${videoData.transcript}\n\n`;
        }

        text += `Title: ${videoData.title || ''}\n`;
        text += `Description: ${videoData.description || ''}\n`;

        if (videoData.caption) {
          text += `Caption: ${videoData.caption}\n`;
        }

        if (videoData.comments && videoData.comments.length > 0) {
          text += `\nTop Comments:\n${videoData.comments.join('\n')}`;
        }

        return {
          type: 'video',
          platform: videoData.platform,
          title: videoData.title || '',
          description: videoData.description || '',
          text: text,
          transcript: videoData.transcript,
          hasTranscript: videoData.hasTranscript,
          comments: videoData.comments,
          metadata: videoData
        };
      } catch (downloadError) {
        logger.warn('Enhanced extraction failed, falling back to basic method:', downloadError.message);

        // Fallback to basic extraction
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          return await this.extractYouTubeContentBasic(url);
        } else if (url.includes('tiktok.com')) {
          return await this.extractTikTokContentBasic(url);
        } else if (url.includes('instagram.com')) {
          return await this.extractInstagramContentBasic(url);
        } else {
          return await this.extractGenericVideoContent(url);
        }
      }
    } catch (error) {
      logger.error('Error extracting video content:', error);
      return await this.extractGenericContent(url);
    }
  }

  async extractYouTubeContentBasic(url) {
    try {
      const videoId = this.extractYouTubeId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const preview = await getLinkPreview(url);

      return {
        type: 'video',
        platform: 'youtube',
        title: preview.title || '',
        description: preview.description || '',
        text: `${preview.title}\n${preview.description}`,
        metadata: {
          videoId,
          url: preview.url,
          images: preview.images,
          note: 'Basic extraction - transcript not available'
        }
      };
    } catch (error) {
      logger.error('YouTube basic extraction error:', error);
      return await this.extractGenericContent(url);
    }
  }

  extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  async extractTikTokContentBasic(url) {
    try {
      const preview = await getLinkPreview(url);

      return {
        type: 'video',
        platform: 'tiktok',
        title: preview.title || '',
        description: preview.description || '',
        text: `${preview.title}\n${preview.description}`,
        metadata: {
          url: preview.url,
          note: 'Basic extraction - install yt-dlp for full support'
        }
      };
    } catch (error) {
      logger.error('TikTok basic extraction error:', error);
      return await this.extractGenericContent(url);
    }
  }

  async extractInstagramContentBasic(url) {
    try {
      const preview = await getLinkPreview(url);

      return {
        type: 'social',
        platform: 'instagram',
        title: preview.title || '',
        description: preview.description || '',
        text: `${preview.title}\n${preview.description}`,
        metadata: {
          url: preview.url,
          note: 'Basic extraction - install instaloader for full support'
        }
      };
    } catch (error) {
      logger.error('Instagram basic extraction error:', error);
      return await this.extractGenericContent(url);
    }
  }

  async extractGenericVideoContent(url) {
    const preview = await getLinkPreview(url);

    return {
      type: 'video',
      platform: 'unknown',
      title: preview.title || '',
      description: preview.description || '',
      text: `${preview.title}\n${preview.description}`,
      metadata: preview
    };
  }

  async extractSocialContent(url) {
    try {
      const preview = await getLinkPreview(url);

      return {
        type: 'social',
        platform: this.detectSocialPlatform(url),
        text: `${preview.title || ''}\n${preview.description || ''}`,
        metadata: preview
      };
    } catch (error) {
      logger.error('Social content extraction error:', error);
      return await this.extractGenericContent(url);
    }
  }

  detectSocialPlatform(url) {
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('reddit.com')) return 'reddit';
    return 'unknown';
  }

  async extractWebContent(url) {
    try {
      const preview = await getLinkPreview(url);

      // For web pages, try to fetch full content
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // Basic HTML stripping (in production, use proper HTML parser)
      const text = this.stripHtml(response.data);

      return {
        type: 'web',
        title: preview.title || '',
        description: preview.description || '',
        text: text.substring(0, 5000), // Limit to 5000 chars
        metadata: preview
      };
    } catch (error) {
      logger.error('Web content extraction error:', error);
      return await this.extractGenericContent(url);
    }
  }

  async extractGenericContent(url) {
    try {
      const preview = await getLinkPreview(url);

      return {
        type: 'web',
        title: preview.title || '',
        description: preview.description || '',
        text: `${preview.title || ''}\n${preview.description || ''}`,
        metadata: preview
      };
    } catch (error) {
      logger.error('Generic content extraction error:', error);
      throw new Error('Failed to extract content from URL');
    }
  }

  stripHtml(html) {
    // Basic HTML stripping - in production use cheerio or similar
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
}

module.exports = new URLService();
