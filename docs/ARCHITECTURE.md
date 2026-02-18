# CORTEX — System Architecture

## Overview

CORTEX uses a 4-layer architecture designed for on-device intelligence with zero cloud dependencies.

## Layers

### 1. UI Layer (SwiftUI)
- Declarative views: ContentView, SearchView, SettingsView
- Tab-based navigation with iOS 17+ features
- Real-time search with debounced input

### 2. Domain Layer (Swift Actors)
- `IndexingService` — thread-safe content indexing pipeline
- `SearchService` — hybrid semantic + keyword search
- Protocol-oriented: `IndexingProtocol`, `SearchProtocol`, `StorageProtocol`

### 3. Engine Layer (ML/NLP)
- **Vision** — OCR for photos and documents
- **NaturalLanguage** — Named entity recognition
- **Core ML** — Embedding generation for semantic search
- All inference runs on-device via Apple Neural Engine

### 4. Storage Layer (Persistent)
- **SQLite FTS5** — Full-text search virtual table
- **CryptoKit** — AES-GCM encryption at rest
- **Keychain** — Secure key storage with biometric access
- `DatabaseManager` — CRUD operations and query interface

## Data Flow

```
User Input → UI Layer → Domain Layer → Engine Layer → Storage Layer
                ↑                                          |
                └──────────── Search Results ───────────────┘
```

## Concurrency Model

Swift actors provide safe concurrent access:
- `IndexingService` actor handles parallel indexing without data races
- `SearchService` actor processes queries with concurrent keyword + semantic search
- `DatabaseManager` uses serial dispatch queue for thread-safe storage access
