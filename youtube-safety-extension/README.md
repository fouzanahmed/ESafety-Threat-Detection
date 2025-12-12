# 🛡️ ESafety YouTube Guardian - Chrome Extension

A Chrome extension MVP that provides real-time safety analysis for YouTube videos, detecting harmful content themes like manosphere ideology, grooming patterns, and cyberbullying.

## 🎯 Features

- **Click-to-Analyze**: Badge appears on YouTube videos - click to trigger analysis
- **Transcript Extraction**: Automatically extracts video transcripts from YouTube
- **Smart Detection**: Uses AI-powered mock classification for harmful content
- **Risk Scoring**: 0-100 risk score with color-coded indicators (Green/Yellow/Red)
- **Detailed Analysis**: Shows detected themes, confidence levels, and recommendations
- **Non-Intrusive UI**: Subtle overlay that doesn't interfere with viewing
- **Privacy-Focused**: Only analyzes when you click (no automatic data collection)

## 📦 Installation

### Step 1: Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `youtube-safety-extension` folder
5. The extension should now appear in your extensions list

### Step 2: Verify Installation

- Look for the extension in your Chrome toolbar (puzzle piece icon)
- You should see "ESafety YouTube Guardian" listed
- The extension is now active on YouTube!

## 🚀 Usage

### Basic Usage

1. **Navigate to any YouTube video** (e.g., `youtube.com/watch?v=...`)
2. **Wait for the badge to appear** in the top-right corner of the video player
3. **Click the badge** that says "Click to Analyze"
4. **Wait for analysis** (takes ~1-2 seconds with mock API)
5. **View results** in the expanded panel

### Reading Results

**Risk Score Colors:**
- 🟢 **Green (0-30)**: Safe content
- 🟡 **Yellow (31-60)**: Caution - contains potentially problematic themes
- 🔴 **Red (61-100)**: High risk - contains harmful or dangerous content

**Panel Sections:**
- **Risk Score**: Overall safety rating (0-100)
- **Detected Themes**: Specific concerning patterns found
- **Analysis**: Explanation of why content was flagged
- **Recommendations**: Suggested actions and resources

### Extension Popup

Click the extension icon in your toolbar to access:
- **Protection Status**: Toggle extension on/off
- **Statistics**: View videos analyzed and threats detected
- **Sensitivity Level**: Adjust detection sensitivity (Low/Medium/High)
- **About**: Information and link to main platform

## 🎬 Demo Guide (Hackathon Pitch)

### Perfect Demo Flow (30 seconds)

1. **Open YouTube video** with manosphere content (search "alpha male", "red pill")
2. **Show badge appearing** automatically on video player
3. **Click badge** and wait for analysis
4. **Highlight risk score** changing to yellow/red
5. **Show detected themes** (e.g., "Manosphere Ideology 90%")
6. **Read key analysis points** aloud
7. **Show extension popup** for settings

### Demo Tips

- Use videos with clear keywords: "alpha male", "red pill", "dating coach"
- Test beforehand to ensure transcript extraction works
- Have backup screenshots ready in case of live demo issues
- Practice the flow to keep it under 30 seconds

### Recommended Test Videos

Look for YouTube videos containing:
- "alpha male mindset"
- "red pill dating advice"
- "pickup artist techniques"
- "MGTOW philosophy"

These will trigger **medium to high risk scores** with multiple detected themes.

## 🔧 Technical Details

### Mock API Logic

The extension uses keyword-based classification:

**High Risk Patterns (30 points each):**
- `alpha male`, `beta male`, `red pill`, `blackpill`
- `pickup artist`, `pua`
- `hypergamy`, `body count`
- `mgtow`

**Medium Risk Patterns (15 points each):**
- `dating coach`, `attract women`
- `masculine`, `masculinity`
- `friend zone`, `sigma male`

**Low Risk Patterns (5 points each):**
- `self improvement`, `confidence`
- `fitness`, `workout`

### Current Limitations (MVP)

1. **Transcript Availability**:
   - Only works if YouTube transcript is available
   - Shows "Transcript unavailable" error if disabled by creator

2. **Mock API**:
   - Uses client-side keyword matching (not real AI)
   - Replace with actual API endpoint for production

3. **English Only**:
   - Currently only analyzes English content

4. **No YouTube Shorts**:
   - Only works on regular YouTube videos (`/watch?v=...`)

## 🔄 Integrating Real API

To connect to your existing ESafety backend:

### 1. Update `background.js`

Replace the `analyzeContent` function (line ~30):

```javascript
async function analyzeContent(data) {
  const response = await fetch('YOUR_API_ENDPOINT/api/analyze/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      text: data.transcript,
      title: data.title,
      description: data.description
    })
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return await response.json();
}
```

### 2. Update Manifest Permissions

Add your API domain to `host_permissions` in `manifest.json`:

```json
"host_permissions": [
  "*://*.youtube.com/*",
  "https://your-api-domain.com/*"
]
```

### 3. Test Integration

- Reload extension after changes
- Check browser console (F12) for any errors
- Verify API responses match expected format

## 🐛 Troubleshooting

### Badge doesn't appear

- **Check**: Is Developer mode enabled?
- **Check**: Are you on a `/watch?v=...` URL?
- **Fix**: Reload the page (Ctrl+R / Cmd+R)
- **Fix**: Reload the extension in `chrome://extensions/`

### "Transcript unavailable" error

- **Cause**: Video creator disabled transcripts
- **Fix**: Try a different video
- **Workaround**: Extension will analyze title/description only (if enabled)

### Analysis takes too long

- **Cause**: YouTube page still loading
- **Fix**: Wait for video player to fully load before clicking badge
- **Fix**: Refresh the page

### Panel appears off-screen

- **Cause**: Browser window too small
- **Fix**: Resize browser window to at least 1200px width
- **Fix**: Zoom out (Ctrl+- / Cmd+-)

### Extension popup blank

- **Cause**: Popup script error
- **Fix**: Right-click extension icon → Inspect popup → Check console
- **Fix**: Reload extension

## 📁 File Structure

```
youtube-safety-extension/
├── manifest.json           # Extension configuration
├── background.js           # Service worker + mock API
├── content.js              # YouTube integration + UI injection
├── styles.css              # Overlay styling
├── popup.html              # Extension popup UI
├── popup.js                # Popup functionality
├── icons/
│   └── icon-generator.html # Icon placeholder generator
└── README.md              # This file
```

## 🎨 Customization

### Changing Colors

Edit `styles.css`:

```css
/* Safe (Green) */
.risk-low { color: #10b981; }

/* Caution (Yellow) */
.risk-medium { color: #f59e0b; }

/* High Risk (Red) */
.risk-high { color: #ef4444; }
```

### Adjusting Position

Edit `styles.css` line 4-5:

```css
#esafety-overlay {
  top: 60px;    /* Distance from top */
  right: 20px;  /* Distance from right */
}
```

### Adding Detection Patterns

Edit `background.js` around line 45-75:

```javascript
const highRiskPatterns = [
  { keywords: ['your', 'keywords'], category: 'category_name', severity: 'high', confidence: 0.85 },
  // Add more patterns...
];
```

## 📸 Screenshots for Pitch

Take screenshots of:

1. **Badge on YouTube** (collapsed state)
2. **Expanded panel** showing:
   - High risk score (red)
   - Medium risk score (yellow)
   - Low/safe score (green)
3. **Extension popup** with statistics
4. **Different video types** being analyzed

## 🚀 Next Steps (Post-MVP)

1. **Real API Integration**: Connect to backend classification API
2. **YouTube Shorts Support**: Extend to short-form video
3. **Batch Analysis**: Analyze multiple videos on homepage/search
4. **Report Generation**: Export analysis reports as PDF
5. **Parental Controls**: Password-protected settings
6. **Notification System**: Alert parents when high-risk content detected
7. **Firefox Support**: Port to Firefox extension
8. **Mobile Support**: Create mobile app version

## 📝 License

Part of the ESafety Threat Detection Platform

## 🤝 Support

For issues or questions:
- Open an issue in the main ESafety repository
- Check console logs (F12 → Console) for errors
- Verify all files are present in the extension folder

## 💡 Tips for Hackathon Judges

- **Innovation**: Industry-first Instagram reel analysis (note: video features in main platform)
- **Privacy**: Click-to-analyze (no surveillance)
- **Accessibility**: No account required
- **Impact**: Protects vulnerable users from harmful content
- **Scalability**: Can integrate with any video platform

---

**Built for Grand Challenge Hackathon** | Version 1.0.0 MVP
