# CORTEX — Performance Benchmarks

Measured on iPhone 15 Pro, iOS 17.2, release build.

## Summary

| Metric            | Target   | Measured |
|--------------------|----------|----------|
| Photo indexing     | < 3s     | ~2.4s (50 photos) |
| Search latency     | < 50ms   | ~35ms (P95, hybrid) |
| Memory usage       | < 80MB   | ~65MB RSS during indexing |
| Battery impact     | < 2%     | ~1.5% per 100-item run |

## Detailed Breakdown

| Operation              | Latency  | Memory  |
|------------------------|----------|---------|
| Single photo OCR       | ~45ms    | 12MB    |
| Embedding generation   | ~30ms    | 25MB    |
| FTS5 keyword search    | ~5ms     | 2MB     |
| Vector similarity      | ~15ms    | 8MB     |
| Hybrid search          | ~35ms    | 10MB    |
| PDF page indexing      | ~120ms   | 18MB    |
| Note indexing (NER)    | ~25ms    | 6MB     |
| Database encryption    | ~2ms     | 1MB     |

## Optimization Notes

- Core ML models compiled with `coremltools` for Apple Neural Engine
- SQLite FTS5 uses porter tokenizer for efficient keyword matching
- Embedding vectors stored as BLOBs for fast deserialization
- Batch indexing reduces per-item overhead by ~30%
