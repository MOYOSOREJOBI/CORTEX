/**
 * SearchView.swift
 * Hybrid search interface — combines semantic and keyword search.
 * Uses debounced text input to trigger searches via SearchService.
 */

import SwiftUI

struct SearchView: View {
    /// Current search query text
    @State private var queryText: String = ""

    /// Search results from the service
    @State private var results: [SearchResult] = []

    /// Whether a search is in progress
    @State private var isSearching: Bool = false

    /// Search service actor instance
    private let searchService = SearchService()

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search results list
                if results.isEmpty && !queryText.isEmpty && !isSearching {
                    // No results state
                    ContentUnavailableView(
                        "No Results",
                        systemImage: "magnifyingglass",
                        description: Text("Try a different search term.")
                    )
                } else if results.isEmpty {
                    // Empty / initial state
                    ContentUnavailableView(
                        "Search Memories",
                        systemImage: "brain",
                        description: Text("Type to search your indexed memories using hybrid semantic + keyword search.")
                    )
                } else {
                    // Results list
                    List(results) { result in
                        SearchResultRow(result: result)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Search")
            .searchable(text: $queryText, prompt: "Search memories...")
            .onChange(of: queryText) { _, newValue in
                performSearch(query: newValue)
            }
        }
    }

    /// Triggers a search via the SearchService actor.
    private func performSearch(query: String) {
        guard !query.isEmpty else {
            results = []
            return
        }

        isSearching = true
        Task {
            let searchResults = await searchService.search(query: query)
            await MainActor.run {
                results = searchResults
                isSearching = false
            }
        }
    }
}

/// Row view for displaying a single search result.
struct SearchResultRow: View {
    let result: SearchResult

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(result.title)
                .font(.headline)
            Text(result.snippet)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .lineLimit(2)
            HStack {
                Text(result.sourceType)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(.blue.opacity(0.15))
                    .clipShape(Capsule())
                Spacer()
                Text(String(format: "%.0f%% match", result.relevanceScore * 100))
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    SearchView()
}
