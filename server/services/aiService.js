const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    // Initialize AI providers
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    if (process.env.GOOGLE_AI_API_KEY) {
      this.googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
      this.geminiModel = this.googleAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      this.geminiVisionModel = this.googleAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    this.systemPrompt = `You are an expert content safety analyst specializing in detecting harmful online content.

Analyze the provided content for the following threat categories:
- incel: Involuntary celibate ideology, misogyny, entitlement to sex/relationships
- mgtow: Men Going Their Own Way rhetoric, anti-women sentiments
- pua: Pick-up artist manipulation tactics, treating women as conquests
- grooming: Predatory behavior toward minors, manipulation, boundary violations
- extremist: Violent extremism, hate speech, radicalization content
- concerning: Potentially harmful but not clearly in above categories
- safe: No significant threats detected

Provide:
1. threatScore (0-100): Overall danger level
2. category: Primary threat category
3. confidence (0-1): Your confidence in the assessment
4. explanation: Clear, specific explanation of why this content is concerning or safe

Focus on patterns like dehumanization, manipulation, violence promotion, hatred, and predatory behavior.`;
  }

  async analyzeContent(text, contentType = 'text') {
    try {
      // Try OpenAI first, fallback to Google AI
      if (this.openai) {
        return await this.analyzeWithOpenAI(text, contentType);
      } else if (this.geminiModel) {
        return await this.analyzeWithGemini(text, contentType);
      } else {
        logger.warn('No AI provider configured, using fallback analysis');
        return this.fallbackAnalysis(text);
      }
    } catch (error) {
      logger.error('AI analysis error:', error);
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(text);
    }
  }

  async analyzeWithOpenAI(text, contentType) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: this.systemPrompt },
        {
          role: 'user',
          content: `Analyze this ${contentType} content for safety threats:\n\n${text}`
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return this.normalizeResponse(result);
  }

  async analyzeWithGemini(text, contentType) {
    const prompt = `${this.systemPrompt}\n\nAnalyze this ${contentType} content for safety threats:\n\n${text}\n\nRespond in JSON format with: threatScore, category, confidence, explanation`;

    const result = await this.geminiModel.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return this.normalizeResponse(parsed);
    }

    throw new Error('Failed to parse Gemini response');
  }

  async analyzeImage(imageBuffer) {
    try {
      if (this.geminiVisionModel) {
        return await this.analyzeImageWithGemini(imageBuffer);
      } else if (this.openai) {
        return await this.analyzeImageWithOpenAI(imageBuffer);
      } else {
        return this.fallbackAnalysis('Image content (AI vision not configured)');
      }
    } catch (error) {
      logger.error('Image analysis error:', error);
      return this.fallbackAnalysis('Image content');
    }
  }

  async analyzeImageWithGemini(imageBuffer) {
    const prompt = `${this.systemPrompt}\n\nAnalyze this image for safety threats. Look for harmful memes, screenshots of concerning conversations, or visual content that matches the threat categories.\n\nRespond in JSON format with: threatScore, category, confidence, explanation`;

    const imageParts = [
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      }
    ];

    const result = await this.geminiVisionModel.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const textResponse = response.text();

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return this.normalizeResponse(parsed);
    }

    throw new Error('Failed to parse Gemini vision response');
  }

  async analyzeImageWithOpenAI(imageBuffer) {
    const base64Image = imageBuffer.toString('base64');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: this.systemPrompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content);
    return this.normalizeResponse(result);
  }

  normalizeResponse(result) {
    return {
      threatScore: Math.max(0, Math.min(100, result.threatScore || 0)),
      category: result.category || 'safe',
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      explanation: result.explanation || 'Analysis completed'
    };
  }

  fallbackAnalysis(text) {
    // Simple rule-based fallback
    const dangerousKeywords = [
      'kill', 'murder', 'rape', 'assault', 'violence',
      'femoid', 'roastie', 'chad', 'blackpill',
      'incel', 'redpill', 'alpha', 'beta'
    ];

    const lowerText = text.toLowerCase();
    let score = 0;

    dangerousKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 15;
      }
    });

    return {
      threatScore: Math.min(score, 100),
      category: score > 50 ? 'concerning' : 'safe',
      confidence: 0.3,
      explanation: score > 50
        ? 'Content contains potentially concerning keywords (fallback analysis)'
        : 'No major concerns detected (fallback analysis)'
    };
  }
}

module.exports = new AIService();
