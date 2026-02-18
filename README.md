# CORTEX

Intelligent on device memory. Private by design.

## What Cortex Does

Cortex is a personal memory system that runs entirely in your browser. It stores notes, ideas, and knowledge in a local IndexedDB database. Nothing leaves your device.

Features:
- Local first storage with IndexedDB
- Hybrid search with keyword and semantic matching
- Reciprocal Rank Fusion for result ranking
- AES GCM encryption for vault export and import
- App lock with passphrase verification
- Full keyboard navigation and accessibility
- Zero telemetry, zero tracking, zero remote analytics

## Setup

```bash
git clone https://github.com/MOYOSOREJOBI/CORTEX.git
cd CORTEX
pnpm install
```

## Dev

```bash
pnpm dev
```

Open http://localhost:3000. The dashboard loads as the root route.

## Test

```bash
pnpm test
```

Runs unit tests for search ranking, encryption, and app constants.

## Lint

```bash
pnpm lint
```

## Build

```bash
pnpm build
```

Creates an optimized production build in `apps/web/.next`.

## Deploy

Set the root directory to `apps/web` in your hosting platform. Cortex works on Vercel, Netlify, or any Node.js host.

```bash
pnpm start
```

Starts the production server.

## Project Structure

```
CORTEX/
  apps/
    web/
      src/
        app/              Page routes and API routes
        components/       DemoDashboard, tabs, error boundary, toasts, lock screen
        hooks/            Custom React hooks
        lib/              Types, constants, db, crypto, search engine, context
        __tests__/        Unit tests
      public/             Static assets (avatar image, logo)
  docs/                   Architecture and privacy docs
  .github/workflows/      CI pipeline (lint, test, build)
```

## Data Model

Cortex uses an IndexedDB database named `cortex` with these stores:

| Store            | Key     | Description                        |
|------------------|---------|------------------------------------|
| memories         | id      | User created memories              |
| searchHistory    | id      | Search query log                   |
| indexRuns        | id      | Index pipeline run records         |
| analyticsEvents  | id      | Local analytics events             |
| settings         | id      | App settings and lock config       |

### Memory Record Fields

| Field       | Type     | Description                       |
|-------------|----------|-----------------------------------|
| id          | string   | Unique identifier                 |
| title       | string   | Memory title                      |
| body        | string   | Memory body text                  |
| tags        | string[] | User tags                         |
| source      | string   | manual, import, or capture        |
| createdAt   | number   | Creation timestamp                |
| updatedAt   | number   | Last update timestamp             |
| pinned      | boolean  | Pinned to top                     |
| sensitivity | string   | normal, sensitive, or restricted  |

## Keyboard Shortcuts

| Key     | Action       |
|---------|------------- |
| Ctrl+1  | Dashboard    |
| Ctrl+2  | Search       |
| Ctrl+3  | Memories     |
| Ctrl+4  | Processing   |
| Ctrl+5  | Privacy      |
| Ctrl+6  | Analytics    |
| Ctrl+7  | About        |
| Tab     | Move focus   |
| Enter   | Activate     |
| Arrows  | Navigate sidebar |

## Tech Stack

- Next.js 14 with App Router
- React 18
- TypeScript (strict mode)
- Tailwind CSS with CSS Modules
- IndexedDB for persistence
- Web Crypto API for encryption
- Vitest for testing
- pnpm workspaces

## Author

Moyosore Jobi

## License

MIT
