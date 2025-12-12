// ESafety YouTube Guardian - Popup Script
// Handles extension popup UI and settings

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadSettings();
  loadStats();
  setupEventListeners();
}

// Load current settings
function loadSettings() {
  chrome.storage.sync.get(['enabled', 'sensitivity'], (items) => {
    const enabled = items.enabled !== false; // Default to true
    const sensitivity = items.sensitivity || 'medium';

    // Update toggle switch
    const toggleSwitch = document.getElementById('toggle-enabled');
    if (enabled) {
      toggleSwitch.classList.add('active');
    } else {
      toggleSwitch.classList.remove('active');
    }

    // Update sensitivity buttons
    document.querySelectorAll('.sensitivity-btn').forEach(btn => {
      if (btn.dataset.level === sensitivity) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  });
}

// Load usage statistics
function loadStats() {
  chrome.storage.local.get(['videosAnalyzed', 'threatsDetected'], (items) => {
    const videosAnalyzed = items.videosAnalyzed || 0;
    const threatsDetected = items.threatsDetected || 0;

    document.getElementById('videos-analyzed').textContent = videosAnalyzed;
    document.getElementById('threats-detected').textContent = threatsDetected;
  });
}

// Setup event listeners
function setupEventListeners() {
  // Toggle enabled/disabled
  const toggleSwitch = document.getElementById('toggle-enabled');
  toggleSwitch.addEventListener('click', () => {
    const isActive = toggleSwitch.classList.contains('active');
    const newState = !isActive;

    toggleSwitch.classList.toggle('active');

    chrome.storage.sync.set({ enabled: newState }, () => {
      console.log('Extension enabled:', newState);

      // Reload active YouTube tabs
      chrome.tabs.query({ url: '*://*.youtube.com/*' }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.reload(tab.id);
        });
      });
    });
  });

  // Sensitivity level buttons
  document.querySelectorAll('.sensitivity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.level;

      // Update UI
      document.querySelectorAll('.sensitivity-btn').forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Save setting
      chrome.storage.sync.set({ sensitivity: level }, () => {
        console.log('Sensitivity set to:', level);
      });
    });
  });

  // Visit platform link
  document.getElementById('visit-platform').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://esafety-platform.com' });
  });
}

// Update stats when popup opens
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.videosAnalyzed || changes.threatsDetected) {
      loadStats();
    }
  }
});
