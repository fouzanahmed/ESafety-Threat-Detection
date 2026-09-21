# API Reference

Base URL: `http://localhost:5000` (configurable via `PORT`)

All analysis and resource endpoints are mounted under `/api`. Requests to `/api/*` are rate-limited (default: 100 requests per 15-minute window per IP, configurable via `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW`) by `server/index.js`. Request bodies are parsed as JSON with a 10MB limit.

## Conventions

- All responses are JSON.
- Successful analysis responses include a generated `id` (UUID) and an ISO 8601 `timestamp`, unless noted otherwise.
- Error responses share the shape produced by `server/middleware/errorHandler.js`:
  ```json
  { "error": "<message>" }
  ```
  or, for file upload (Multer) and validation errors:
  ```json
  { "error": "File too large", "message": "Maximum file size is 10MB" }
  ```
  In non-production environments, unhandled errors also include a `stack` field.
- `threatScore` is an integer from 0 (safe) to 100 (severe threat).
- `category` is one of: `safe`, `concerning`, `incel`, `mgtow`, `pua`, `grooming`, `extremist`, `general`.

---

## Health

### `GET /health`
Basic liveness check (not under `/api`, not rate-limited).

**Response `200`**
```json
{
  "status": "ok",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "uptime": 123.45
}
```

---

## Analysis Endpoints (`/api/analyze`)

### `POST /api/analyze/text`
Analyze raw text for threats using combined AI + rule-based NLP analysis.

**Request body**
```json
{ "text": "Some message content to analyze" }
```
- `text` (string, required, max 50,000 characters)

**Response `200`**
```json
{
  "id": "b3f1c2a0-....",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "contentType": "text",
  "threatScore": 42,
  "category": "concerning",
  "explanation": "...",
  "detectedPatterns": { "...": "..." },
  "confidence": 0.8,
  "recommendations": ["Consider reporting this content to the platform"]
}
```

**Errors**
- `400` — `{ "error": "Text content is required" }`
- `400` — `{ "error": "Text is too long. Maximum 50,000 characters." }`

---

### `POST /api/analyze/image`
Analyze a single uploaded image (OCR text extraction + AI image/text analysis).

**Request**: `multipart/form-data`
- `image` (file, required — JPEG/PNG/GIF/WebP, max 10MB)

**Response `200`**
```json
{
  "id": "b3f1c2a0-....",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "contentType": "image",
  "threatScore": 15,
  "category": "safe",
  "explanation": "Image: ... | Text: ...",
  "hasText": true,
  "extractedText": "text found in the image",
  "confidence": 0.75,
  "recommendations": ["This content appears safe"]
}
```

**Errors**
- `400` — `{ "error": "Image file is required" }`
- `400` — `{ "error": "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." }`
- `400` — `{ "error": "File too large", "message": "Maximum file size is 10MB" }`

---

### `POST /api/analyze/images`
Batch-analyze up to 10 images in one request, including per-image cyberbullying analysis.

**Request**: `multipart/form-data`
- `images` (files, required — up to 10, same type/size limits as above)

**Response `200`**
```json
{
  "id": "b3f1c2a0-....",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "contentType": "multi-image",
  "totalImages": 2,
  "overallThreatScore": 20,
  "individualResults": [
    {
      "imageIndex": 1,
      "threatScore": 10,
      "category": "safe",
      "explanation": "...",
      "hasText": false,
      "extractedText": null,
      "cyberbullying": { "...": "..." }
    }
  ],
  "recommendations": []
}
```

**Errors**
- `400` — `{ "error": "At least one image file is required" }`

---

### `POST /api/analyze/url`
Analyze content from a URL (web page, social post, or video link).

**Request body**
```json
{ "url": "https://example.com/article" }
```
- `url` (string, required, must be a valid URL)

**Response `200`**
```json
{
  "id": "b3f1c2a0-....",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "contentType": "web",
  "url": "https://example.com/article",
  "threatScore": 42,
  "category": "concerning",
  "explanation": "...",
  "metadata": { "title": "Example" },
  "confidence": 0.8,
  "recommendations": []
}
```

**Errors**
- `400` — `{ "error": "Valid URL is required" }`

---

### `POST /api/analyze/batch`
Analyze up to 10 mixed text/URL items in a single request.

**Request body**
```json
{
  "items": [
    { "type": "text", "content": "some text content" },
    { "type": "url", "content": "https://example.com" }
  ]
}
```
- `items` (array, required, max 10 entries) — each item has `type` (`"text"` or `"url"`) and `content` (string)

**Response `200`**
```json
{
  "results": [
    { "threatScore": 29, "category": "concerning", "explanation": "..." },
    { "url": "https://example.com", "threatScore": 42, "category": "concerning", "explanation": "..." }
  ],
  "total": 2
}
```
A per-item failure is reported in place within `results` as `{ "error": "<message>", "index": <n> }` rather than failing the whole batch.

**Errors**
- `400` — `{ "error": "Items array is required" }`
- `400` — `{ "error": "Maximum 10 items per batch" }`

---

### `POST /api/analyze/deepfake`
Specialized deepfake detection on a single uploaded image (7 visual + 6 contextual indicators).

**Request**: `multipart/form-data`
- `image` (file, required — same type/size limits as `/image`)

**Response `200`**
```json
{
  "id": "b3f1c2a0-....",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "contentType": "deepfake-analysis",
  "isLikelyDeepfake": false,
  "confidence": 0.6,
  "riskLevel": "low",
  "indicators": ["..."],
  "aiAnalysis": "...",
  "recommendations": ["..."]
}
```

**Errors**
- `400` — `{ "error": "Image file is required" }`

---

### `POST /api/analyze/grooming`
Specialized grooming pattern detection (50+ patterns across 8 categories), accepting either plain text or a message thread.

**Request body** (one of)
```json
{ "text": "you can trust me, keep this secret and send me a picture" }
```
```json
{
  "messages": [
    { "text": "you can trust me" },
    { "text": "keep this secret, our secret" },
    { "text": "send me a picture" }
  ]
}
```

**Response `200`**
```json
{
  "id": "b3f1c2a0-....",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "contentType": "grooming-analysis",
  "isGrooming": true,
  "threatScore": 65,
  "riskLevel": "high",
  "detectedPatterns": {
    "trustBuilding": ["..."],
    "secrecy": ["..."],
    "solicitation": ["..."]
  },
  "conversationAnalysis": {
    "progressionScore": 60,
    "phases": ["..."]
  },
  "recommendations": ["If this involves a minor, contact local authorities immediately", "Visit NCMEC.org for resources"]
}
```
`conversationAnalysis` is `null` when `messages` is not provided.

**Errors**
- `400` — `{ "error": "Text or messages array is required" }`

---

### `POST /api/analyze/cyberbullying`
Specialized cyberbullying detection (40+ patterns across 8 types, coordinated-attack identification), accepting text or a message thread.

**Request body**
```json
{
  "text": "you are so ugly, kill yourself",
  "metadata": { "userId": "user-123" }
}
```
or
```json
{
  "messages": [
    { "text": "you are so ugly", "senderId": "a" },
    { "text": "nobody wants you, go away", "senderId": "b" }
  ],
  "metadata": { "userId": "user-123" }
}
```

**Response `200`**
```json
{
  "id": "b3f1c2a0-....",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "contentType": "cyberbullying-analysis",
  "isCyberbullying": true,
  "threatScore": 80,
  "riskLevel": "high",
  "bullyingType": "threats",
  "detectedPatterns": { "...": "..." },
  "threadAnalysis": {
    "totalIncidents": 2,
    "isPersistent": false,
    "isCoordinated": false,
    "pattern": "..."
  },
  "recommendations": ["..."]
}
```
`threadAnalysis` is `null` when `messages` is not provided.

**Errors**
- `400` — `{ "error": "Text or messages array is required" }`

---

### `POST /api/analyze/conversation`
Full timeline analysis of a message thread, combining grooming-progression tracking, cyberbullying-thread analysis, and AI review of overall conversation risk with phase detection.

**Request body**
```json
{
  "messages": [
    { "text": "you can trust me, keep this secret" },
    { "text": "send me a picture, meet in person" }
  ],
  "analysisType": "full"
}
```
- `messages` (array, required) — each entry is `{ "text": "..." }` (or a plain string)
- `analysisType` (string, optional, currently unused by the response shape below)

**Response `200`**
```json
{
  "id": "b3f1c2a0-....",
  "timestamp": "2026-09-22T10:00:00.000Z",
  "contentType": "conversation-analysis",
  "messageCount": 2,
  "overallThreatScore": 75,
  "grooming": {
    "detected": true,
    "phases": ["trust-building", "isolation"],
    "progressionScore": 70,
    "urgency": "high"
  },
  "cyberbullying": {
    "detected": false,
    "incidentCount": 0,
    "isPersistent": false,
    "isCoordinated": false,
    "pattern": null
  },
  "aiAnalysis": {
    "category": "grooming",
    "explanation": "...",
    "confidence": 0.8
  },
  "recommendations": [
    "🚨 GROOMING DETECTED: Contact authorities immediately if minor involved",
    "Report to NCMEC CyberTipline: CyberTipline.org"
  ]
}
```

**Errors**
- `400` — `{ "error": "Messages array is required" }`

---

## Resource Endpoints (`/api/resources`)

### `GET /api/resources`
Return the full resource catalog, keyed by category.

**Response `200`** (abridged)
```json
{
  "incel": { "...": "..." },
  "mgtow": { "...": "..." },
  "pua": { "...": "..." },
  "grooming": {
    "title": "Child Safety Resources - URGENT",
    "description": "If this involves a child, take immediate action",
    "emergencyContact": {
      "name": "National Center for Missing & Exploited Children",
      "phone": "1-800-843-5678",
      "online": "CyberTipline.org",
      "available": "24/7"
    },
    "helplines": ["..."],
    "resources": ["..."],
    "actions": ["..."]
  },
  "extremist": { "...": "..." },
  "concerning": { "...": "..." },
  "safe": { "...": "..." },
  "general": { "...": "..." }
}
```

### `GET /api/resources/:category`
Return resources for a single category (`incel`, `mgtow`, `pua`, `grooming`, `extremist`, `concerning`, `safe`, or `general`).

**Response `200`**
```json
{
  "category": "grooming",
  "resources": {
    "title": "Child Safety Resources - URGENT",
    "emergencyContact": { "name": "National Center for Missing & Exploited Children", "phone": "1-800-843-5678" },
    "helplines": ["..."],
    "resources": ["..."],
    "actions": ["..."]
  }
}
```

**Errors**
- `404` — `{ "error": "Category not found" }`

### `POST /api/resources/feedback`
Submit feedback on a prior analysis result (logged server-side; not currently persisted to a database).

**Request body**
```json
{
  "analysisId": "b3f1c2a0-....",
  "feedback": "This assessment was accurate",
  "helpful": true
}
```

**Response `200`**
```json
{ "message": "Thank you for your feedback", "received": true }
```
