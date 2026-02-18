# CORTEX — Privacy Design

## Principles

1. **On-Device Only** — All processing (OCR, NER, embeddings, search) happens locally
2. **Encrypted Storage** — All data encrypted at rest with AES-GCM (CryptoKit)
3. **Zero Telemetry** — No analytics, crash reports, or usage tracking by default
4. **Full Control** — Users can delete any memory or wipe all data instantly

## Technical Details

### Encryption
- Algorithm: AES-GCM via Apple CryptoKit
- Key storage: iOS Keychain with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`
- Biometric access control: optional Face ID / Touch ID requirement

### Network
- Zero network requests during normal operation
- No iCloud sync, no Firebase, no external APIs
- App functions fully in airplane mode

### Data Lifecycle
- Indexing: content processed and stored locally
- Deletion: immediate and permanent (no retention period)
- No backups to external services
