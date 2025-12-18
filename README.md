# TGS Viewer ✨

Single-page web app to drag & drop `.tgs` or `.json` Lottie files and play them instantly. Built with a youthful vibe, smooth theme transitions, and friendly UX. 🚀

## Features 🌟
- Drag & drop upload with valid-format highlighting
- Support for `.tgs` and Lottie `.json`
- Smooth dark/light theme toggle with persistence
- Play, Pause, Restart controls
- Speed slider `0.25×–2×`
- Hotkeys: `Space` (Play/Pause), `R` (Restart)
- Download Lottie as `.json`
- Clear status messages and error indicators
- Responsive layout with centered controls under the animation

## Getting Started 🛠️
1. Clone the repository: 'git clone https://github.com/Th3ryks/TGSViewer.git'
2. Start any static server in the project root
   - macOS/Unix: `python3 -m http.server 8000`
3. Open `http://localhost:8000/`

## Usage 🎬
- Drop a `.tgs` or `.json` file into the dropzone or choose via the button
- Use the controls below the animation to play/pause/restart
- Adjust playback speed with the slider
- Press `Lottie` to download the current animation as JSON

## Keyboard Shortcuts ⌨️
- `Space`: Play/Pause
- `R`: Restart

## Supported Formats 📦
- `.tgs` (gzip-compressed Lottie JSON)
- `.json` (raw Lottie)

## Tech Stack ⚙️
- `lottie-web` for playback
- `pako` for `.tgs` gzip inflate/deflate
- Vanilla HTML/CSS/JS

## License 📄
MIT — see `LICENSE` for details.