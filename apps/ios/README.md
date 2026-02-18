# CORTEX iOS App

On-device intelligent memory system for iOS 17+.

## Requirements

- Xcode 15+
- iOS 17.0+ deployment target
- [XcodeGen](https://github.com/yonaskolb/XcodeGen) for project generation

## Setup

```bash
# Install XcodeGen
brew install xcodegen

# Generate Xcode project
cd apps/ios
xcodegen generate

# Open in Xcode
open Cortex.xcodeproj
```

## Architecture

- **SwiftUI** declarative views with tab-based navigation
- **Swift Actors** for thread-safe indexing and search services
- **Protocol-oriented** design for testability (IndexingProtocol, SearchProtocol, StorageProtocol)
- **SQLite FTS5** for keyword search, vector similarity for semantic search
- **CryptoKit** encryption with Keychain key storage

## Author

Built by Moyosore Jobi
