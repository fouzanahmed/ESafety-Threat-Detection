# Instagram Reel frame extraction

When `POST /api/analyze/url` gets an Instagram Reel link, the server tries to
download the video and analyze still frames from it along with the caption.

Code: `server/services/videoDownloadService.js`
(`handleInstagramReelWithFrames`) and
`server/services/videoFrameExtractionService.js`.

## Pipeline

1. Take the shortcode from the reel URL.
2. Download the reel with `instaloader`. If the `instaloader` command isn't
   found, the server tries `python -m instaloader`.
3. Read the duration with `ffprobe`, then use `ffmpeg` to grab three frames: at
   0.1 s, at half the duration, and at 0.5 s before the end.
4. Resize each frame with `sharp` to fit within 1280×720 (smaller frames are
   not enlarged) and save it as a JPEG at quality 85.
5. Pass the frames and caption on for analysis.
6. Delete the frames directory 60 seconds later.

If FFmpeg isn't installed, the service skips frame extraction and returns the
video path with a note saying FFmpeg is needed. If `instaloader` isn't
installed either, the server falls back to the standard metadata path.

## Requirements

- `instaloader` (`pip install instaloader`)
- FFmpeg and ffprobe on `PATH`. The `install-video-tools.*` scripts in the repo
  root install them, and [WINDOWS_SETUP.md](../WINDOWS_SETUP.md) has Windows
  notes.

## Limitations

- Only public reels work, because `instaloader` runs without logging in.
- Audio isn't transcribed. `transcribeVideo` is a placeholder with a TODO for a
  speech-to-text integration.
- Three frames only sample the video, so content between them isn't seen.
