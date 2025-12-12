// ESafety YouTube Guardian - Background Service Worker
// Handles API communication with Gemini AI

// Gemini API Configuration
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Replace with your Gemini API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeContent') {
    analyzeContent(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }

  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['enabled', 'sensitivity'], (items) => {
      sendResponse({
        enabled: items.enabled !== false, // Default to true
        sensitivity: items.sensitivity || 'medium'
      });
    });
    return true;
  }
});

// Real Gemini API Analysis Function
async function analyzeContent(data) {
  const { transcript, title, description } = data;

  // Combine content for analysis
  const contentToAnalyze = `
TITLE: ${title}

DESCRIPTION: ${description}

TRANSCRIPT: ${transcript || 'No transcript available'}
  `.trim();

  // Create analysis prompt for Gemini
  const prompt = `You are an AI safety analyst for the ESafety platform. Analyze the following YouTube video content for harmful themes and online safety concerns.

Analyze for these threat categories:
- Manosphere/Red Pill/Incel ideology (misogyny, toxic masculinity, anti-women rhetoric)
- Pickup Artist (PUA) tactics and manipulative dating advice
- Online grooming patterns (predatory behavior, manipulation of minors)
- Cyberbullying and harassment
- Extremist content (radicalization, hate speech)
- Discriminatory or harmful stereotypes

CONTENT TO ANALYZE:
${contentToAnalyze}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no other text):
{
  "risk_score": <number 0-100>,
  "risk_level": "<low|medium|high>",
  "detected_themes": [
    {
      "category": "<descriptive_category_name>",
      "confidence": <0.0-1.0>,
      "severity": "<low|medium|high>"
    }
  ],
  "explanation": "<2-3 sentence explanation of why this content was flagged or deemed safe>",
  "recommendations": "<actionable advice for viewers>"
}

Risk scoring guide:
- 0-30: Safe/low risk
- 31-60: Medium risk (caution advised)
- 61-100: High risk (concerning content)

Be thorough but balanced. If content is genuinely educational or safe, mark it as low risk even if it discusses sensitive topics.`;

  try {
    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();

    // Extract text from Gemini response
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON from response (remove markdown code blocks if present)
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysisResult = JSON.parse(jsonText);

    // Validate and return result
    return {
      risk_score: analysisResult.risk_score || 0,
      risk_level: analysisResult.risk_level || 'low',
      detected_themes: analysisResult.detected_themes || [],
      explanation: analysisResult.explanation || 'Analysis completed.',
      recommendations: analysisResult.recommendations || 'Continue to consume content critically.',
      analyzed_at: new Date().toISOString()
    };

  } catch (error) {
    console.error('Gemini API Error:', error);

    // Fallback error response
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

// Initialize default settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    sensitivity: 'medium'
  });
  console.log('ESafety YouTube Guardian installed');
});
