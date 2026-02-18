# CORTEX — Intelligent On-Device Memory

![Dashboard](docs/screenshot.png)

## What is CORTEX?

CORTEX is an AI-powered on-device memory system that intelligently indexes, searches, and organizes your digital content — photos, PDFs, notes, and more — entirely on your device.

Built as a full-stack portfolio project, CORTEX features a stunning glassmorphism web dashboard (deployed on Vercel) and a companion iOS app skeleton showcasing on-device ML/NLP capabilities with Swift actors, Core ML, Vision OCR, and SQLite FTS5.

Every piece of data stays on your device. No cloud sync. No telemetry. Privacy is the architecture, not a feature toggle.

## Live Demo

🌐 [View Live Dashboard](#) — *Deploy to Vercel to get your URL*

## Tech Stack

| Layer         | Web                          | iOS                           |
|---------------|------------------------------|-------------------------------|
| **UI**        | Next.js 14, React, Tailwind  | SwiftUI (iOS 17+)             |
| **Language**  | TypeScript (strict)          | Swift 5.9                     |
| **Styling**   | CSS Modules, Glassmorphism   | Native SwiftUI                |
| **APIs**      | Next.js Route Handlers       | Swift Actors                  |
| **Search**    | —                            | SQLite FTS5 + Vector Similarity |
| **ML/NLP**    | —                            | Core ML, Vision, NaturalLanguage |
| **Security**  | —                            | CryptoKit, Keychain           |
| **Deploy**    | Vercel                       | Xcode / TestFlight            |
| **CI**        | GitHub Actions               | XcodeGen                      |

## Features

- 🧠 **Smart Indexing** — Photos, PDFs, Notes automatically indexed on-device
- 🔍 **Hybrid Search** — Semantic + keyword search powered by FTS5 and vector similarity
- 🔒 **Privacy First** — All processing on-device, encrypted storage, zero telemetry
- 🎨 **Glassmorphism UI** — Apple-inspired dashboard with 3D card tilt, radial hover effects
- ⚡ **Performant** — < 50ms search latency, < 80MB memory footprint
- 📱 **iOS Native** — Swift actors for safe concurrency, protocol-oriented architecture

## Quick Start

```bash
git clone https://github.com/yourusername/cortex.git
cd cortex
pnpm install
pnpm dev
# Visit http://localhost:3000
```

## Project Structure

```
cortex/
├── apps/
│   ├── web/                    # Next.js 14 App Router (Vercel deploy target)
│   │   ├── src/
│   │   │   ├── app/            # Pages and API routes
│   │   │   ├── components/     # React components (DemoDashboard, Navbar, etc.)
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   └── lib/            # Types and constants
│   │   └── public/             # Static assets
│   │
│   └── ios/                    # iOS app skeleton (not part of web build)
│       └── Cortex/
│           ├── App/            # App entry point
│           ├── Views/          # SwiftUI views
│           ├── Models/         # Data models
│           ├── Services/       # Swift actor services
│           └── Storage/        # Database manager
│
├── docs/                       # Architecture, privacy, and performance docs
├── scripts/                    # Setup scripts
├── .github/workflows/          # CI pipeline
├── DEPLOYMENT.md               # Vercel deployment guide
└── README.md
```

## Pages

| Route           | Description                              |
|-----------------|------------------------------------------|
| `/`             | Premium landing page with animated hero  |
| `/demo`         | Glassmorphism dashboard (interactive)    |
| `/architecture` | System architecture overview             |
| `/privacy`      | Privacy-first design philosophy          |
| `/benchmarks`   | Performance metrics and benchmarks       |
| `/build`        | Tech stack and build information         |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step Vercel deployment instructions.

**Quick deploy:** Set Root Directory to `apps/web` in Vercel, and deploy. That's it.

## iOS Development

The iOS app requires Xcode 15+ and XcodeGen:

```bash
brew install xcodegen
cd apps/ios
xcodegen generate
open Cortex.xcodeproj
```

See [apps/ios/README.md](apps/ios/README.md) for details.

## Author

**Moyosore Jobi**

- Portfolio: [moyosore.dev](https://moyosore.dev)

## License

MIT — see [LICENSE](LICENSE)
