/**
 * IndexingService.swift
 * Swift actor responsible for indexing content into CORTEX.
 * Handles OCR (Vision), NER (NaturalLanguage), and embedding generation (Core ML).
 *
 * Uses actor isolation for thread-safe concurrent indexing operations.
 */

import Foundation

// MARK: - Protocol

/// Protocol defining the indexing contract.
/// Enables dependency injection and testing.
protocol IndexingProtocol: Sendable {
    /// Index a single memory item from raw content.
    func indexItem(title: String, content: String, contentType: MemoryContentType, sourcePath: String?) async throws -> MemoryItem

    /// Index multiple items in batch.
    func indexBatch(items: [(title: String, content: String, contentType: MemoryContentType)]) async throws -> [MemoryItem]

    /// Get the current indexing status.
    func status() async -> IndexingStatus
}

/// Represents the current state of the indexing pipeline.
struct IndexingStatus: Sendable {
    let isProcessing: Bool
    let itemsProcessed: Int
    let itemsRemaining: Int
    let lastError: String?
}

// MARK: - Actor Implementation

/// Thread-safe indexing service using Swift actor concurrency.
actor IndexingService: IndexingProtocol {
    /// Reference to the database for persisting indexed items
    private let database: DatabaseManager

    /// Number of items processed in the current session
    private var processedCount: Int = 0

    /// Whether the service is currently processing
    private var isProcessing: Bool = false

    /// Last error message, if any
    private var lastError: String?

    /// Initialize with a database manager instance.
    init(database: DatabaseManager = DatabaseManager()) {
        self.database = database
    }

    /// Index a single item: extract content, generate embedding, and store.
    func indexItem(
        title: String,
        content: String,
        contentType: MemoryContentType,
        sourcePath: String? = nil
    ) async throws -> MemoryItem {
        isProcessing = true
        defer {
            isProcessing = false
            processedCount += 1
        }

        // Generate a placeholder embedding (in production, use Core ML)
        let embedding = generatePlaceholderEmbedding(for: content)

        // Create the memory item
        let item = MemoryItem(
            title: title,
            content: content,
            contentType: contentType,
            sourcePath: sourcePath,
            embedding: embedding
        )

        // Persist to database
        await database.save(item: item)

        return item
    }

    /// Index multiple items in batch for efficiency.
    func indexBatch(
        items: [(title: String, content: String, contentType: MemoryContentType)]
    ) async throws -> [MemoryItem] {
        var results: [MemoryItem] = []
        results.reserveCapacity(items.count)

        for item in items {
            let indexed = try await indexItem(
                title: item.title,
                content: item.content,
                contentType: item.contentType
            )
            results.append(indexed)
        }

        return results
    }

    /// Returns the current indexing pipeline status.
    func status() async -> IndexingStatus {
        IndexingStatus(
            isProcessing: isProcessing,
            itemsProcessed: processedCount,
            itemsRemaining: 0,
            lastError: lastError
        )
    }

    // MARK: - Private Helpers

    /// Generates a placeholder embedding vector.
    /// In production, this would use a Core ML model.
    private func generatePlaceholderEmbedding(for text: String) -> [Float] {
        // 128-dimensional placeholder — deterministic based on text hash
        let hash = text.hashValue
        return (0..<128).map { i in
            Float(sin(Double(hash &+ i))) * 0.5
        }
    }
}
