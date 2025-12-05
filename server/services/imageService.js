const sharp = require('sharp');
const logger = require('../utils/logger');

class ImageService {
  async processImage(buffer) {
    try {
      // Process and optimize image
      const processedBuffer = await sharp(buffer)
        .resize(1920, 1920, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      return processedBuffer;
    } catch (error) {
      logger.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  async extractText(imageBuffer) {
    try {
      // In production, integrate with Tesseract.js or Google Cloud Vision OCR
      // For now, return empty string and rely on AI vision models
      //
      // Example integration:
      // const { createWorker } = require('tesseract.js');
      // const worker = await createWorker('eng');
      // const { data: { text } } = await worker.recognize(imageBuffer);
      // await worker.terminate();
      // return text;

      logger.info('OCR not implemented, relying on AI vision');
      return '';
    } catch (error) {
      logger.error('Error extracting text from image:', error);
      return '';
    }
  }

  async getImageMetadata(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha
      };
    } catch (error) {
      logger.error('Error getting image metadata:', error);
      return null;
    }
  }

  async detectImageType(buffer) {
    const metadata = await this.getImageMetadata(buffer);

    if (!metadata) return 'unknown';

    // Detect likely content type based on characteristics
    if (metadata.width > 1000 && metadata.height > 500) {
      return 'screenshot';
    }

    if (metadata.width === metadata.height) {
      return 'social_media_post';
    }

    return 'photo';
  }

  async generateThumbnail(buffer, size = 200) {
    try {
      const thumbnail = await sharp(buffer)
        .resize(size, size, { fit: 'cover' })
        .jpeg({ quality: 70 })
        .toBuffer();

      return thumbnail;
    } catch (error) {
      logger.error('Error generating thumbnail:', error);
      return null;
    }
  }
}

module.exports = new ImageService();
