# Agent Instructions for This Repository

You are operating autonomously, assigned exactly ONE backlog task. Follow these rules in order before making any change:

1. Read README.md fully before touching anything.
2. Inspect the repository structure (list directories, note the stack).
3. Run `git log --oneline -30` to see recent history — do not repeat work already done.
4. You will be given recent entries from this repo's automation history (prior categories/files touched). Never repeat the same category of change within 14 days unless the task explicitly says otherwise.
5. Check existing tests and CI config before adding new ones — extend, don't duplicate.
6. You have been assigned exactly one backlog item (given to you in the task prompt). Implement only that item. Do not expand scope, do not "also fix" unrelated things you notice — note them as follow-up ideas in your final structured output instead.
7. Preserve the project's actual purpose and existing architecture. Don't introduce a new framework/library/technology unless the task explicitly calls for it.
8. Keep the change small: 1-5 files, one logical commit's worth of work (a couple of commits' worth only if genuinely separate concerns, e.g. code + its test).
9. Test everything you change. Run the test suite, linter, and type checker (whichever exist in this repo) yourself before finishing. If you cannot get them passing, report failure — do not leave the working tree in a broken state.
10. NEVER fabricate results, metrics, benchmarks, or datasets. Never claim a feature exists if it doesn't. Any number you write into docs must be verifiable from real code/tests/data in this repo.
11. If the assigned task turns out to be already done, no longer applicable, or genuinely unsafe to do in one run, say so clearly in your structured output and stop — do not force an unrelated change to avoid "wasting the run."
12. Do not run `git add`, `git commit`, or `git push`, and do not open a PR. Leave your edits unstaged in the working tree — the orchestrator independently re-runs your tests, then handles staging, the commit, the push, and PR creation using the structured summary you provide at the end of your turn.

## Project-Specific Section

- **Goal:** A content-safety analysis platform that screens text, images, URLs, and conversations for online-safety threats (grooming, cyberbullying, deepfakes) across multiple harm categories, exposing the results through a REST API and a React frontend.
- **Architecture:**
  - `server/index.js` — Express app entrypoint: helmet, compression, CORS, rate limiting, a `/health` endpoint, and `errorHandler` middleware already wired in
  - `server/routes/analysis.js` — 9 analysis endpoints (text, image, images, url, batch, deepfake, grooming, cyberbullying, conversation)
  - `server/routes/resources.js` — 3 endpoints for safety resources/feedback
  - `server/middleware/errorHandler.js` — already handles Multer/validation/default errors with a structured JSON shape — do not re-implement this
  - `client/` and `esafety-frontend/` — React frontends (two exist; treat `client/` as the primary one referenced by the root `package.json`'s `client` script unless a task says otherwise)
- **Technologies:** Node.js, Express, React, MongoDB, Docker, GPT/Gemini APIs for content analysis.
- **Recruiter skills demonstrated:** REST API design, middleware/security hardening (helmet, rate limiting), multi-modal AI integration, containerization.
- **Allowed improvement areas:** `server/`, `docs/` (new), `README.md`, `.github/workflows/` (new), test files under `server/__tests__/` (new).
- **Do not touch automatically:** `.env`/secrets, `youtube-safety-extension/`, deployment scripts (`deploy.js`, `install-video-tools.*`), the AI model/prompt logic inside the analysis controllers unless the task explicitly targets it.
