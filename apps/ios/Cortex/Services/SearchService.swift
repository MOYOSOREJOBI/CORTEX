/**
 * SearchService.swift
 * Swift actor for hybrid search combining semantic and keyword matching.
 * Queries both FTS5 (keyword) and vector similarity (semantic) indexes.
 *
 * Uses actor isolation for thread-safe search operations.
 */

import Foundation

// MARK: - Protocol

/// Protocol defining the search contract.
/// Enables dependency injection and testing.
protocol SearchProtocol: Sendable {
    /// Perform a hybrid search combining keyword and semantic results.
    func search(query: String) async -> [SearchResult]

    /// Perform keyword-only search via FTS5.
    func keywordSearch(query: String) async -> [SearchResult]

    /// Perform semantic-only search via vector similarity.
    func semanticSearch(query: String) async -> [SearchResult]
}

// MARK: - Actor Implementation

/// Thread-safe search service using Swift actor concurrency.
actor SearchService: SearchProtocol {
    /// Reference to the database for querying indexed items
    private let database: DatabaseManager

    /// Weight for keyword search results in hybrid scoring (0.0 to 1.0)
    private let keywordWeight: Double = 0.4

    /// Weight for semantic search results in hybrid scoring (0.0 to 1.0)
    private let semanticWeight: Double = 0.6

    /// Initialize with a database manager instance.
    init(database: DatabaseManager = DatabaseManager()) {
        self.database = database
    }

    /// Hybrid search: combines FTS5 keyword results with vector similarity results.
    /// Returns results sorted by combined relevance score.
    func search(query: String) async -> [SearchResult] {
        guard !query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return []
        }

        // Run both search types concurrently
        async let keywordResults = keywordSearch(query: query)
        async let semanticResults = semanticSearch(query: query)

        let kResults = await keywordResults
        let sResults = await semanticResults

        // Merge and deduplicate results
        return mergeResults(keyword: kResults, semantic: sResults)
    }

    /// Keyword search using SQLite FTS5.
    /// In production, this would query the FTS5 virtual table.
    func keywordSearch(query: String) async -> [SearchResult] {
        // Placeholder: returns empty results
        // In production: SELECT * FROM memories_fts WHERE memories_fts MATCH ?
        let items = await database.fetchAll()
        return items
            .filter { $0.content.localizedCaseInsensitiveContains(query) }
            .map { item in
                SearchResult(
                    title: item.title,
                    snippet: extractSnippet(from: item.content, matching: query),
                    sourceType: item.contentType.rawValue,
                    relevanceScore: 0.7,
                    memoryItemId: item.id
                )
            }
    }

    /// Semantic search using vector similarity.
    /// In production, this would compute cosine similarity against stored embeddings.
    func semanticSearch(query: String) async -> [SearchResult] {
        // Placeholder: returns empty results
        // In production: compute query embedding via Core ML, then cosine similarity
        return []
    }

    // MARK: - Private Helpers

    /// Merges keyword and semantic results, deduplicating by memory item ID.
    private func mergeResults(
        keyword: [SearchResult],
        semantic: [SearchResult]
    ) -> [SearchResult] {
        var resultMap: [UUID: SearchResult] = [:]

        // Add keyword results with weighted scores
        for result in keyword {
            let weighted = SearchResult(
                id: result.id,
                title: result.title,
                snippet: result.snippet,
                sourceType: result.sourceType,
                relevanceScore: result.relevanceScore * keywordWeight,
                memoryItemId: result.memoryItemId
            )
            resultMap[result.memoryItemId] = weighted
        }

        // Merge semantic results — add scores for duplicates
        for result in semantic {
            if let existing = resultMap[result.memoryItemId] {
                let combined = SearchResult(
                    id: existing.id,
                    title: existing.title,
                    snippet: existing.snippet,
                    sourceType: existing.sourceType,
                    relevanceScore: existing.relevanceScore + (result.relevanceScore * semanticWeight),
                    memoryItemId: existing.memoryItemId
                )
                resultMap[result.memoryItemId] = combined
            } else {
                let weighted = SearchResult(
                    id: result.id,
                    title: result.title,
                    snippet: result.snippet,
                    sourceType: result.sourceType,
                    relevanceScore: result.relevanceScore * semanticWeight,
                    memoryItemId: result.memoryItemId
                )
                resultMap[result.memoryItemId] = weighted
            }
        }

        // Sort by relevance (highest first)
        return resultMap.values.sorted { $0.relevanceScore > $1.relevanceScore }
    }

    /// Extracts a text snippet around the first match of the query.
    private func extractSnippet(from content: String, matching query: String) -> String {
        guard let range = content.range(of: query, options: .caseInsensitive) else {
            // Return first 100 characters if no match found
            return String(content.prefix(100))
        }

        let snippetStart = content.index(range.lowerBound, offsetBy: -40, limitedBy: content.startIndex) ?? content.startIndex
        let snippetEnd = content.index(range.upperBound, offsetBy: 40, limitedBy: content.endIndex) ?? content.endIndex
        let snippet = String(content[snippetStart..<snippetEnd])

        return snippet.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
