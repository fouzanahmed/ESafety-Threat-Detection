// ESafety YouTube Guardian - Content Script
// Injects overlay UI into YouTube and handles transcript extraction

(function() {
  'use strict';

  let analysisOverlay = null;
  let currentVideoId = null;
  let analysisResult = null;
  let isAnalyzing = false;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('ESafety YouTube Guardian: Initializing...');

    // YouTube is a Single Page Application, so we need to watch for navigation
    observePageChanges();

    // Check if we're already on a video page
    if (isVideoPage()) {
      handleVideoPage();
    }
  }

  // Watch for YouTube navigation (SPA routing)
  function observePageChanges() {
    let lastUrl = location.href;

    // Method 1: Watch for URL changes
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        handleNavigation();
      }
    }).observe(document.querySelector('body'), {
      childList: true,
      subtree: true
    });

    // Method 2: Listen to YouTube's navigation events
    window.addEventListener('yt-navigate-finish', handleNavigation);
  }

  function handleNavigation() {
    console.log('ESafety: Navigation detected');

    // Remove old overlay if exists
    removeOverlay();

    // Reset state
    currentVideoId = null;
    analysisResult = null;
    isAnalyzing = false;

    // Check if new page is a video page
    if (isVideoPage()) {
      handleVideoPage();
    }
  }

  function isVideoPage() {
    // Check for regular videos (/watch?v=...)
    if (location.pathname === '/watch' && location.search.includes('v=')) {
      return true;
    }
    // Check for YouTube Shorts (/shorts/VIDEO_ID)
    if (location.pathname.startsWith('/shorts/')) {
      return true;
    }
    return false;
  }

  function getVideoId() {
    // Regular video: /watch?v=VIDEO_ID
    if (location.pathname === '/watch') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('v');
    }
    // YouTube Shorts: /shorts/VIDEO_ID
    if (location.pathname.startsWith('/shorts/')) {
      const pathParts = location.pathname.split('/');
      return pathParts[2]; // VIDEO_ID is the 3rd part
    }
    return null;
  }

  function handleVideoPage() {
    const videoId = getVideoId();

    if (!videoId) {
      console.warn('ESafety: No video ID found');
      return;
    }

    console.log('ESafety: Video page detected:', videoId);
    console.log('ESafety: Path:', location.pathname);
    console.log('ESafety: Is Short:', location.pathname.startsWith('/shorts/'));
    currentVideoId = videoId;

    // Different selectors for regular videos vs Shorts
    const isShort = location.pathname.startsWith('/shorts/');

    // For Shorts, try multiple selectors
    if (isShort) {
      console.log('ESafety: Trying Shorts selectors...');
      tryMultipleSelectors([
        'ytd-reel-video-renderer[is-active] #player',
        'ytd-reel-video-renderer #player-container',
        '#shorts-player',
        'ytd-shorts #player',
        '#player',
        '.html5-video-player'
      ]).then((container) => {
        console.log('ESafety: Shorts player found:', container);
        injectOverlay();
      }).catch(e => {
        console.error('ESafety: Could not find Shorts player', e);
        // Try one more time with a delay
        setTimeout(() => {
          const fallback = document.querySelector('#player') || document.querySelector('.html5-video-player');
          if (fallback) {
            console.log('ESafety: Shorts player found (delayed fallback)');
            injectOverlay();
          }
        }, 2000);
      });
    } else {
      // Regular video
      waitForElement('#movie_player').then(() => {
        console.log('ESafety: Video player loaded');
        injectOverlay();
      }).catch(error => {
        console.warn('ESafety: Primary player selector failed, trying fallback');
        waitForElement('.html5-video-player').then(() => {
          console.log('ESafety: Video player loaded (fallback)');
          injectOverlay();
        }).catch(e => {
          console.error('ESafety: Could not find video player', e);
        });
      });
    }
  }

  // Try multiple selectors in sequence
  async function tryMultipleSelectors(selectors) {
    for (const selector of selectors) {
      try {
        const element = await waitForElement(selector, 3000);
        if (element) {
          console.log('ESafety: Found element with selector:', selector);
          return element;
        }
      } catch (e) {
        console.log('ESafety: Selector failed:', selector);
        continue;
      }
    }
    throw new Error('No selector matched');
  }

  // Utility: Wait for element to appear in DOM
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Timeout
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  // Inject the overlay badge
  function injectOverlay() {
    if (analysisOverlay) {
      console.log('ESafety: Overlay already injected');
      return;
    }

    const isShort = location.pathname.startsWith('/shorts/');

    // Try multiple selectors for different YouTube layouts
    let playerContainer;

    if (isShort) {
      // For Shorts, try Shorts-specific containers first
      playerContainer = document.querySelector('ytd-reel-video-renderer[is-active]') ||
                       document.querySelector('ytd-shorts') ||
                       document.querySelector('#shorts-container') ||
                       document.querySelector('#player') ||
                       document.querySelector('.html5-video-player') ||
                       document.querySelector('#player-container') ||
                       document.querySelector('body'); // Ultimate fallback for Shorts
    } else {
      // For regular videos
      playerContainer = document.querySelector('#movie_player') ||
                       document.querySelector('.html5-video-player') ||
                       document.querySelector('#player-container');
    }

    if (!playerContainer) {
      console.error('ESafety: Could not find video player container');
      return;
    }

    console.log('ESafety: Injecting overlay into:', playerContainer.tagName, playerContainer.id || playerContainer.className);

    // Create overlay container
    analysisOverlay = document.createElement('div');
    analysisOverlay.id = 'esafety-overlay';
    analysisOverlay.className = `esafety-badge collapsed ${isShort ? 'esafety-shorts' : ''}`;

    // Get shield icon URL
    const shieldIconUrl = chrome.runtime.getURL('icons/shield.png');

    // Create badge (collapsed state)
    analysisOverlay.innerHTML = `
      <div class="esafety-badge-content">
        <img src="${shieldIconUrl}" class="esafety-icon" alt="Shield">
        <div class="esafety-badge-text">Click to Analyze</div>
      </div>

      <div class="esafety-panel" style="display: none;">
        <div class="esafety-panel-header">
          <div class="esafety-panel-title">
            <img src="${shieldIconUrl}" class="esafety-icon-large" alt="Shield">
            <span>Guardian Content Analysis</span>
          </div>
          <button class="esafety-close-btn" title="Close">✕</button>
        </div>

        <div class="esafety-panel-body">
          <div class="esafety-loading" style="display: none;">
            <div class="esafety-spinner"></div>
            <p>Analyzing content...</p>
          </div>

          <div class="esafety-error" style="display: none;">
            <p class="esafety-error-message"></p>
          </div>

          <div class="esafety-results" style="display: none;">
            <div class="esafety-score-section">
              <div class="esafety-score-label">Risk Score</div>
              <div class="esafety-score-value"></div>
              <div class="esafety-risk-level"></div>
            </div>

            <div class="esafety-themes-section">
              <h4>Detected Themes</h4>
              <div class="esafety-themes-list"></div>
            </div>

            <div class="esafety-analysis-section">
              <h4>Analysis</h4>
              <p class="esafety-explanation"></p>
            </div>

            <div class="esafety-recommendations-section">
              <h4>Recommendations</h4>
              <p class="esafety-recommendations"></p>
            </div>

            <div class="esafety-actions">
              <button class="esafety-btn esafety-btn-primary" id="esafety-full-report">
                View Full Report
              </button>
              <button class="esafety-btn esafety-btn-secondary" id="esafety-dismiss">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Append to player
    playerContainer.appendChild(analysisOverlay);

    // Add event listeners
    setupEventListeners();

    console.log('ESafety: Overlay injected');
  }

  function setupEventListeners() {
    if (!analysisOverlay) return;

    // Click badge to analyze
    const badge = analysisOverlay.querySelector('.esafety-badge-content');
    badge.addEventListener('click', handleBadgeClick);

    // Close button
    const closeBtn = analysisOverlay.querySelector('.esafety-close-btn');
    closeBtn.addEventListener('click', collapsePanel);

    // Dismiss button
    const dismissBtn = analysisOverlay.querySelector('#esafety-dismiss');
    dismissBtn.addEventListener('click', collapsePanel);

    // Full report button
    const reportBtn = analysisOverlay.querySelector('#esafety-full-report');
    reportBtn.addEventListener('click', () => {
      // Open main platform with video URL
      const videoUrl = window.location.href;
      window.open(`https://esafety-platform.com/analyze?url=${encodeURIComponent(videoUrl)}`, '_blank');
    });
  }

  async function handleBadgeClick() {
    if (isAnalyzing) return; // Already analyzing

    // Get current video ID
    const videoId = getVideoId();

    // If we already have results for THIS video, just expand
    // Otherwise, clear old results and analyze new video
    if (analysisResult && analysisResult.videoId === videoId) {
      expandPanel();
      return;
    }

    // Clear old results if video changed
    analysisResult = null;

    // Start analysis
    await analyzeVideo();
  }

  async function analyzeVideo() {
    isAnalyzing = true;
    expandPanel();
    showLoading();

    try {
      // Extract video data
      const videoData = await extractVideoData();

      if (!videoData.transcript && !videoData.title) {
        throw new Error('Could not extract video data');
      }

      // Send to background script for analysis
      const response = await chrome.runtime.sendMessage({
        action: 'analyzeContent',
        data: videoData
      });

      if (response.success) {
        analysisResult = response.data;
        analysisResult.videoId = getVideoId(); // Store video ID with result
        displayResults(analysisResult);
      } else {
        throw new Error(response.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('ESafety: Analysis error:', error);
      showError(error.message);
    } finally {
      isAnalyzing = false;
      hideLoading();
    }
  }

  async function extractVideoData() {
    console.log('ESafety: Extracting video data...');

    // Extract title
    const titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
                        document.querySelector('h1.title');
    const title = titleElement ? titleElement.textContent.trim() : '';

    // Extract description
    const descElement = document.querySelector('ytd-text-inline-expander#description yt-formatted-string') ||
                       document.querySelector('#description yt-formatted-string');
    const description = descElement ? descElement.textContent.trim().substring(0, 500) : '';

    // Extract transcript
    let transcript = '';
    try {
      transcript = await extractTranscript();
    } catch (error) {
      console.warn('ESafety: Could not extract transcript:', error.message);
    }

    console.log('ESafety: Extracted data:', {
      titleLength: title.length,
      descriptionLength: description.length,
      transcriptLength: transcript.length
    });

    return { title, description, transcript };
  }

  async function extractTranscript() {
    // Try to get transcript from YouTube's API data
    try {
      // Method 1: Check if transcript is available in page data
      const transcriptData = await getTranscriptFromYouTubeAPI();
      if (transcriptData) return transcriptData;
    } catch (error) {
      console.warn('ESafety: API transcript extraction failed:', error);
    }

    // Method 2: Try to open transcript panel and extract
    try {
      const transcriptFromPanel = await extractTranscriptFromPanel();
      if (transcriptFromPanel) return transcriptFromPanel;
    } catch (error) {
      console.warn('ESafety: Panel transcript extraction failed:', error);
    }

    throw new Error('Transcript unavailable for this video');
  }

  async function getTranscriptFromYouTubeAPI() {
    // Look for ytInitialPlayerResponse in page scripts
    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
      const content = script.textContent;
      if (content.includes('ytInitialPlayerResponse')) {
        try {
          const match = content.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
          if (match) {
            const data = JSON.parse(match[1]);
            const captions = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

            if (captions && captions.length > 0) {
              // Get first caption track (usually auto-generated or English)
              const captionUrl = captions[0].baseUrl;
              const response = await fetch(captionUrl);
              const xmlText = await response.text();

              // Parse XML and extract text
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
              const textElements = xmlDoc.querySelectorAll('text');

              const transcript = Array.from(textElements)
                .map(el => el.textContent)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

              return transcript;
            }
          }
        } catch (error) {
          console.warn('ESafety: Error parsing ytInitialPlayerResponse:', error);
        }
      }
    }

    return null;
  }

  async function extractTranscriptFromPanel() {
    // This method is more complex and may not work reliably
    // For MVP, we'll throw an error if API method fails
    throw new Error('Panel extraction not implemented in MVP');
  }

  function expandPanel() {
    if (!analysisOverlay) return;

    const badge = analysisOverlay.querySelector('.esafety-badge-content');
    const panel = analysisOverlay.querySelector('.esafety-panel');

    badge.style.display = 'none';
    panel.style.display = 'block';
    analysisOverlay.classList.remove('collapsed');
    analysisOverlay.classList.add('expanded');
  }

  function collapsePanel() {
    if (!analysisOverlay) return;

    const badge = analysisOverlay.querySelector('.esafety-badge-content');
    const panel = analysisOverlay.querySelector('.esafety-panel');

    panel.style.display = 'none';
    badge.style.display = 'flex';
    analysisOverlay.classList.remove('expanded');
    analysisOverlay.classList.add('collapsed');
  }

  function showLoading() {
    if (!analysisOverlay) return;

    const loading = analysisOverlay.querySelector('.esafety-loading');
    const error = analysisOverlay.querySelector('.esafety-error');
    const results = analysisOverlay.querySelector('.esafety-results');

    loading.style.display = 'block';
    error.style.display = 'none';
    results.style.display = 'none';
  }

  function hideLoading() {
    if (!analysisOverlay) return;

    const loading = analysisOverlay.querySelector('.esafety-loading');
    loading.style.display = 'none';
  }

  function showError(message) {
    if (!analysisOverlay) return;

    const error = analysisOverlay.querySelector('.esafety-error');
    const errorMsg = analysisOverlay.querySelector('.esafety-error-message');
    const results = analysisOverlay.querySelector('.esafety-results');

    errorMsg.textContent = message;
    error.style.display = 'block';
    results.style.display = 'none';
  }

  function displayResults(result) {
    if (!analysisOverlay) return;

    const resultsDiv = analysisOverlay.querySelector('.esafety-results');
    const error = analysisOverlay.querySelector('.esafety-error');

    // Update badge color based on risk level
    updateBadgeColor(result.risk_level);

    // Populate results
    const scoreValue = analysisOverlay.querySelector('.esafety-score-value');
    const riskLevel = analysisOverlay.querySelector('.esafety-risk-level');
    const themesList = analysisOverlay.querySelector('.esafety-themes-list');
    const explanation = analysisOverlay.querySelector('.esafety-explanation');
    const recommendations = analysisOverlay.querySelector('.esafety-recommendations');

    scoreValue.textContent = `${result.risk_score}/100`;
    scoreValue.className = `esafety-score-value risk-${result.risk_level}`;

    riskLevel.textContent = getRiskLevelText(result.risk_level);
    riskLevel.className = `esafety-risk-level risk-${result.risk_level}`;

    // Display themes
    if (result.detected_themes && result.detected_themes.length > 0) {
      themesList.innerHTML = result.detected_themes
        .map(theme => `
          <div class="esafety-theme-item">
            <span class="esafety-theme-name">${formatCategoryName(theme.category)}</span>
            <span class="esafety-theme-confidence">${Math.round(theme.confidence * 100)}%</span>
          </div>
        `)
        .join('');
    } else {
      themesList.innerHTML = '<p class="esafety-no-themes">No concerning themes detected</p>';
    }

    explanation.textContent = result.explanation;
    recommendations.textContent = result.recommendations;

    error.style.display = 'none';
    resultsDiv.style.display = 'block';
  }

  function updateBadgeColor(riskLevel) {
    if (!analysisOverlay) return;

    const badge = analysisOverlay.querySelector('.esafety-badge-content');
    badge.className = `esafety-badge-content risk-${riskLevel}`;

    // Update badge text
    const badgeText = analysisOverlay.querySelector('.esafety-badge-text');
    badgeText.textContent = getRiskLevelText(riskLevel);
  }

  function getRiskLevelText(level) {
    switch (level) {
      case 'low': return '✓ SAFE';
      case 'medium': return '⚠️ CAUTION';
      case 'high': return '⛔ HIGH RISK';
      default: return 'UNKNOWN';
    }
  }

  function formatCategoryName(category) {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function removeOverlay() {
    if (analysisOverlay && analysisOverlay.parentNode) {
      analysisOverlay.parentNode.removeChild(analysisOverlay);
    }
    analysisOverlay = null;
  }

})();
