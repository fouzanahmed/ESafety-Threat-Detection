# eSafety Threat Detection

A full-stack content safety platform built during the Grand Challenge hackathon
(Nov 2024 to Jan 2025). You give it text, images, a link or a short video, and it
returns a 0 to 100 threat score, a category, the reasoning behind it, and
support resources. GPT-4 and Gemini do the scoring. FFmpeg pulls frames out of
video so it reads more than captions.

The brief was protecting children and teenagers online: grooming,
cyberbullying, deepfakes, and extremist or incel content.

---

## What it does

- **Two LLM providers.** OpenAI GPT-4 and Google Gemini score content on a 0 to
  100 scale across 8 threat types: grooming, cyberbullying, deepfakes and
  manipulated media, incel / MGTOW / PUA ideology, extremism, coordinated attacks,
  persistent harassment, and general threats.
- **Video, not only text.** For Instagram Reels, FFmpeg extracts the first,
  middle and last frames and analyzes them alongside the caption and metadata.
  YouTube gets transcript extraction and TikTok gets metadata analysis.
- **90+ detection patterns.** Grooming patterns (50+) track how a conversation
  progresses through stages, cyberbullying patterns (40+) fingerprint attack
  types and coordinated pile-ons, and deepfake checks use 7 visual and 6
  contextual indicators.
- **Batch and conversation analysis.** Up to 10 images in one request, and full
  conversation threads analyzed as a timeline.
- **Structured output.** Each analysis returns JSON with the score, category,
  explanation and recommended resources.
- **On demand only.** Nothing is monitored in the background, and no account is
  needed.

---

## Architecture

```
React 18 client (Material-UI) ──► Express API ──► aiService ──► GPT-4 / Gemini
                                     │
                                     ├── detection services (grooming, cyberbullying, deepfake)
                                     ├── imageService (sharp), urlService
                                     ├── videoDownloadService ─► videoFrameExtractionService (FFmpeg)
                                     └── MongoDB (optional, analytics + feedback)
```

| Path | What's there |
|---|---|
| `server/` | Express API: routes, controllers, detection services, validation, logging |
| `client/` | React 18 + Material-UI web app |
| `esafety-frontend/` | Alternative Next.js + TypeScript front end from the hackathon |
| `youtube-safety-extension/` | Chrome extension prototype for checking YouTube videos |

---

## API

Mounted under `/api`, rate-limited, with `helmet` and `express-validator` on
the free-text and URL inputs. `GET /health` reports service status.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/analyze/text` | Analyze a block of text |
| POST | `/api/analyze/image` | Analyze one uploaded image |
| POST | `/api/analyze/images` | Analyze up to 10 images in one request |
| POST | `/api/analyze/url` | Analyze a link (Instagram, YouTube, TikTok) |
| POST | `/api/analyze/batch` | Analyze up to 10 text or URL items together |
| POST | `/api/analyze/deepfake` | Deepfake indicators on an image |
| POST | `/api/analyze/grooming` | Grooming pattern detection |
| POST | `/api/analyze/cyberbullying` | Cyberbullying pattern detection |
| POST | `/api/analyze/conversation` | Timeline analysis of a conversation thread |
| GET | `/api/resources` | All support resources |
| GET | `/api/resources/:category` | Resources for one threat category |
| POST | `/api/resources/feedback` | Submit feedback on an analysis |

Request and response details for the specialized endpoints are in
[docs/detection-services.md](docs/detection-services.md). The Reel video
pipeline is described in
[docs/video-frame-extraction.md](docs/video-frame-extraction.md).

---

## Running it

You need Node.js 18+ and an OpenAI or Google AI key. FFmpeg is only needed for
video frame extraction, and MongoDB is optional.

```bash
npm run install-all          # server + client dependencies
cp .env.example .env         # add your API key(s)
npm run dev                  # API on :5000, client on :3000
```

Optional video tooling: `install-video-tools.bat` on Windows or
`./install-video-tools.sh` on macOS/Linux. Windows notes are in
[WINDOWS_SETUP.md](WINDOWS_SETUP.md).

With Docker, `docker-compose up` starts the full stack.

---

## Tests and CI

```bash
npm test
```

19 Jest + Supertest integration tests cover the analysis endpoints. Writing
them turned up a real bug: `/batch` and `/conversation` lost their `this`
binding when passed to the router, so both routes failed at runtime. GitHub
Actions runs the server tests on Node 18 and 20 and builds the client on every
push and pull request.

---

## Status

This is hackathon code, kept as it was built, with tests, request validation
and CI added since. Technical write-ups are in [`docs/`](docs/). The original
pitch materials are archived in [`docs/hackathon/`](docs/hackathon/), and the
other Markdown files in the root are setup notes from the hackathon. Detection
quality depends on the LLM providers and hasn't been measured against a labeled dataset here. A separate project, a fine-tuned
multi-label classifier, did that work for the Kaggle stage of the same
challenge.

## License

MIT
