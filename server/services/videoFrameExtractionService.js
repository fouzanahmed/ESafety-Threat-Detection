const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const logger = require('../utils/logger');

const execAsync = promisify(exec);

class VideoFrameExtractionService {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    await fs.ensureDir(this.tempDir);
  }

  /**
   * Extract frames from Instagram reel downloaded by instaloader
   * @param {string} shortcode - Instagram reel shortcode
   * @returns {Promise<Object>} - Object with frame paths and metadata
   */
  async extractInstagramReelFrames(shortcode) {
    try {
      // Find the downloaded video file
      const reelDir = path.join(this.tempDir, '..');
      const files = await fs.readdir(reelDir);

      // Look for video file with the shortcode
      const videoFile = files.find(f => f.includes(shortcode) && f.endsWith('.mp4'));

      if (!videoFile) {
        logger.warn(`No video file found for shortcode: ${shortcode}`);
        return null;
      }

      const videoPath = path.join(reelDir, videoFile);
      logger.info(`Found Instagram reel video: ${videoPath}`);

      // Create output directory for frames
      const framesDir = path.join(this.tempDir, `frames_${shortcode}`);
      await fs.ensureDir(framesDir);

      // Check if ffmpeg is available
      const hasFFmpeg = await this.checkFFmpeg();

      if (hasFFmpeg) {
        return await this.extractFramesWithFFmpeg(videoPath, framesDir, shortcode);
      } else {
        logger.warn('FFmpeg not available, using alternative method');
        return await this.extractFramesAlternative(videoPath, framesDir, shortcode);
      }
    } catch (error) {
      logger.error('Error extracting Instagram reel frames:', error);
      return null;
    }
  }

  /**
   * Check if FFmpeg is installed
   */
  async checkFFmpeg() {
    try {
      await execAsync('ffmpeg -version');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract frames using FFmpeg (preferred method)
   */
  async extractFramesWithFFmpeg(videoPath, framesDir, shortcode) {
    try {
      // Get video duration
      const durationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
      const { stdout: durationOutput } = await execAsync(durationCmd);
      const duration = parseFloat(durationOutput.trim());

      logger.info(`Video duration: ${duration} seconds`);

      // Extract first frame (at 0.1s)
      const firstFramePath = path.join(framesDir, 'frame_first.jpg');
      await execAsync(`ffmpeg -i "${videoPath}" -ss 0.1 -vframes 1 "${firstFramePath}" -y`);

      // Extract middle frame
      const middleTime = duration / 2;
      const middleFramePath = path.join(framesDir, 'frame_middle.jpg');
      await execAsync(`ffmpeg -i "${videoPath}" -ss ${middleTime} -vframes 1 "${middleFramePath}" -y`);

      // Extract last frame
      const lastTime = Math.max(0, duration - 0.5);
      const lastFramePath = path.join(framesDir, 'frame_last.jpg');
      await execAsync(`ffmpeg -i "${videoPath}" -ss ${lastTime} -vframes 1 "${lastFramePath}" -y`);

      logger.info('Successfully extracted frames with FFmpeg');

      // Optimize frames with sharp
      const frames = [];
      for (const frameName of ['first', 'middle', 'last']) {
        const framePath = path.join(framesDir, `frame_${frameName}.jpg`);
        if (await fs.pathExists(framePath)) {
          // Resize and optimize
          const optimizedPath = path.join(framesDir, `frame_${frameName}_optimized.jpg`);
          await sharp(framePath)
            .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(optimizedPath);

          frames.push({
            name: frameName,
            path: optimizedPath,
            originalPath: framePath
          });
        }
      }

      return {
        shortcode,
        videoPath,
        duration,
        frames,
        framesDir,
        extractionMethod: 'ffmpeg'
      };
    } catch (error) {
      logger.error('FFmpeg frame extraction error:', error);
      throw error;
    }
  }

  /**
   * Alternative method when FFmpeg is not available
   * Uses first second and last second logic
   */
  async extractFramesAlternative(videoPath, framesDir, shortcode) {
    // For now, just return the video path
    // In a production environment, you might use a different video processing library
    logger.warn('Alternative frame extraction not fully implemented');
    return {
      shortcode,
      videoPath,
      frames: [],
      framesDir,
      extractionMethod: 'none',
      note: 'Install FFmpeg for frame extraction: https://ffmpeg.org/download.html'
    };
  }

  /**
   * Transcribe video audio using external service or API
   * For now, returns placeholder - integrate with speech-to-text API like OpenAI Whisper
   */
  async transcribeVideo(videoPath) {
    try {
      logger.info(`Transcription requested for: ${videoPath}`);

      // TODO: Integrate with speech-to-text service
      // Options:
      // 1. OpenAI Whisper API
      // 2. Google Cloud Speech-to-Text
      // 3. AWS Transcribe
      // 4. Local Whisper model

      // Placeholder response
      return {
        hasAudio: false,
        transcript: '',
        note: 'Video transcription requires speech-to-text API integration'
      };
    } catch (error) {
      logger.error('Video transcription error:', error);
      return {
        hasAudio: false,
        transcript: '',
        error: error.message
      };
    }
  }

  /**
   * Clean up extracted frames and temporary files
   */
  async cleanup(framesDir) {
    try {
      if (framesDir && await fs.pathExists(framesDir)) {
        await fs.remove(framesDir);
        logger.info(`Cleaned up frames directory: ${framesDir}`);
      }
    } catch (error) {
      logger.error('Cleanup error:', error);
    }
  }

  /**
   * Main method to process Instagram reel
   * Downloads with instaloader, extracts frames, and prepares for analysis
   */
  async processInstagramReel(url) {
    try {
      // Extract shortcode from URL
      const shortcode = this.extractShortcode(url);
      if (!shortcode) {
        throw new Error('Invalid Instagram URL - could not extract shortcode');
      }

      logger.info(`Processing Instagram reel: ${shortcode}`);

      // Download reel using instaloader
      const downloadResult = await this.downloadReel(shortcode);

      if (!downloadResult.success) {
        return {
          success: false,
          error: 'Failed to download Instagram reel',
          note: downloadResult.note
        };
      }

      // Extract frames from downloaded video
      const framesData = await this.extractInstagramReelFrames(shortcode);

      if (!framesData || !framesData.frames || framesData.frames.length === 0) {
        logger.warn('No frames extracted, but reel was downloaded');
        return {
          success: true,
          shortcode,
          hasFrames: false,
          note: 'Reel downloaded but frame extraction failed. Install FFmpeg for frame extraction.'
        };
      }

      // Transcribe video (if audio exists)
      const transcription = await this.transcribeVideo(framesData.videoPath);

      return {
        success: true,
        shortcode,
        hasFrames: true,
        frames: framesData.frames,
        duration: framesData.duration,
        transcription: transcription.transcript || '',
        hasAudio: transcription.hasAudio,
        framesDir: framesData.framesDir,
        extractionMethod: framesData.extractionMethod
      };
    } catch (error) {
      logger.error('Error processing Instagram reel:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Download Instagram reel using instaloader
   */
  async downloadReel(shortcode) {
    try {
      const targetDir = path.join(this.tempDir, '..');

      // Try direct command first
      let command = `instaloader --no-profile-pic --no-metadata-json --dirname-pattern="${targetDir}" -- -${shortcode}`;

      try {
        await execAsync(command, { timeout: 30000 });
        logger.info('Downloaded Instagram reel with instaloader');
        return { success: true };
      } catch (cmdError) {
        // Try as Python module (Windows)
        logger.info('Retrying with python -m instaloader...');
        command = `python -m instaloader --no-profile-pic --no-metadata-json --dirname-pattern="${targetDir}" -- -${shortcode}`;
        await execAsync(command, { timeout: 30000 });
        logger.info('Downloaded Instagram reel with python -m instaloader');
        return { success: true };
      }
    } catch (error) {
      logger.error('Failed to download Instagram reel:', error);
      return {
        success: false,
        note: 'Install instaloader: pip install instaloader'
      };
    }
  }

  /**
   * Extract shortcode from Instagram URL
   */
  extractShortcode(url) {
    const match = url.match(/(?:\/p\/|\/reel\/)([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }
}

module.exports = new VideoFrameExtractionService();
