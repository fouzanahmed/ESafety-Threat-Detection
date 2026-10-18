# Specialized detection services

Besides general text, image and URL analysis, the API has endpoints for
specific harm types. Three of them (grooming, cyberbullying, and the rule-based
half of the conversation endpoint) work by keyword and phrase pattern matching
in `server/services/`. Deepfake and conversation analysis also call the LLM
through `aiService`.

All routes live in `server/routes/analysis.js`, and the handlers are in
`server/controllers/analysisController.js`.

## Pattern inventory

These counts come from the pattern lists in the service constructors.

| Service | File | Categories | Patterns |
|---|---|---|---|
| Grooming | `groomingDetectionService.js` | trustBuilding, secrecy, isolation, desensitization, solicitation, meetingAttempts, giftGiving, emotionalManipulation | 61 |
| Cyberbullying | `cyberbullyingDetectionService.js` | insults, threats, exclusion, humiliation, sexualHarassment, doxxing, impersonation, stalking | 64 |
| Deepfake | `deepfakeDetectionService.js` | visual indicators, contextual indicators | 7 + 6 |

The cyberbullying service also applies severity multipliers for repeated,
public, coordinated and persistent attacks.

Grooming risk levels are `low` (score under 20), `moderate` (under 40), `high`
(under 60) and `critical` (60 and up).

## Endpoints

### `POST /api/analyze/grooming`

JSON body with either `text` (a single message) or `messages` (an array of
`{ text, timestamp }` objects or plain strings). With `messages`, the service
looks at how the thread moves through grooming phases, and it also scores the
combined text.

Response fields: `isGrooming`, `threatScore`, `riskLevel`, `detectedPatterns`,
`conversationAnalysis` (`null` for single-text input), `recommendations`.

```bash
curl -X POST http://localhost:5000/api/analyze/grooming \
  -H "Content-Type: application/json" \
  -d '{"text":"You can trust me. Keep this secret."}'
```

### `POST /api/analyze/cyberbullying`

JSON body with `text` or `messages`, plus optional `metadata` (for example
`isPublic`, `isRepeated`, `userId`). For threads, messages can carry
`senderId`, `timestamp` and `isPublic`, which feed into persistence and
coordinated-attack detection.

Response fields: `isCyberbullying`, `threatScore`, `riskLevel`,
`bullyingType`, `detectedPatterns`, `threadAnalysis` (`null` for single-text
input), `recommendations`.

### `POST /api/analyze/deepfake`

`multipart/form-data` with one `image` file. The image is sent to the LLM with
a deepfake-specific prompt, and the reply is checked against the indicator
lists above.

Response fields: `isLikelyDeepfake`, `confidence`, `riskLevel`, `indicators`,
`aiAnalysis`, `recommendations`.

### `POST /api/analyze/images`

`multipart/form-data` with up to 10 files under the `images` field. Each image
gets its own analysis, and the response also includes an overall score.

### `POST /api/analyze/conversation`

JSON body with a `messages` array. It runs grooming conversation analysis,
cyberbullying thread analysis, and an LLM pass over the whole conversation.
`overallThreatScore` is the highest of the three scores.

Response fields: `messageCount`, `overallThreatScore`, `grooming`
(`detected`, `phases`, `progressionScore`, `urgency`), `cyberbullying`
(`detected`, `incidentCount`, `isPersistent`, `isCoordinated`, `pattern`),
`aiAnalysis` (`category`, `explanation`, `confidence`), `recommendations`.

## Limitations

- Grooming and cyberbullying detection match fixed English phrases, so
  paraphrases, slang and other languages are mostly missed.
- None of the detectors has been evaluated against a labeled dataset in this
  repo, so there are no accuracy figures.
- Recommendations are fixed strings chosen by score and matched patterns.
