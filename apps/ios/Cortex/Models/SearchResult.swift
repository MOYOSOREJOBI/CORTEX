/**
 * SearchResult.swift
 * Represents a search result from hybrid semantic + keyword search.
 * Combines relevance scoring from both FTS5 and vector similarity.
 */

import Foundation

/// A single search result with relevance metadata.
struct SearchResult: Identifiable, Codable {
    /// Unique identifier for this result
    let id: UUID

    /// Title of the matching memory item
    let title: String

    /// Text snippet showing the matching content
    let snippet: String

    /// Source type label (e.g., "Photo", "Document", "Note")
    let sourceType: String

    /// Combined relevance score (0.0 to 1.0)
    /// Blends FTS5 rank and cosine similarity
    let relevanceScore: Double

    /// The original memory item ID this result references
    let memoryItemId: UUID

    /// Creates a new SearchResult.
    init(
        id: UUID = UUID(),
        title: String,
        snippet: String,
        sourceType: String,
        relevanceScore: Double,
        memoryItemId: UUID
    ) {
        self.id = id
        self.title = title
        self.snippet = snippet
        self.sourceType = sourceType
        self.relevanceScore = min(max(relevanceScore, 0.0), 1.0)
        self.memoryItemId = memoryItemId
    }
}
