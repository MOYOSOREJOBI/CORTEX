/**
 * DatabaseManager.swift
 * Manages SQLite database for persisting indexed memories.
 * Handles CRUD operations and FTS5 full-text search index.
 *
 * Uses @Observable for SwiftUI integration (iOS 17+).
 * In production, this would use raw SQLite C API or a wrapper like GRDB.
 */

import Foundation
import Observation

// MARK: - Protocol

/// Protocol defining the storage contract.
/// Enables dependency injection and testing.
protocol StorageProtocol: Sendable {
    /// Save a memory item to the database.
    func save(item: MemoryItem) async

    /// Fetch all stored memory items.
    func fetchAll() async -> [MemoryItem]

    /// Delete a memory item by its ID.
    func delete(id: UUID) async -> Bool

    /// Clear all stored data.
    func clearAll() async
}

// MARK: - Implementation

/// Observable database manager for CORTEX memory storage.
/// Placeholder implementation — in production, replace with actual SQLite operations.
@Observable
final class DatabaseManager: StorageProtocol, @unchecked Sendable {
    /// In-memory store (placeholder for SQLite)
    private var items: [MemoryItem] = []

    /// Serial queue for thread-safe access to the items array
    private let queue = DispatchQueue(label: "dev.cortex.database", qos: .userInitiated)

    /// Number of stored items
    var itemCount: Int {
        queue.sync { items.count }
    }

    /// Initialize the database manager.
    /// In production, this would open/create the SQLite database and FTS5 virtual table.
    init() {
        // Placeholder: In production, execute:
        // CREATE TABLE IF NOT EXISTS memories (...)
        // CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(title, content)
    }

    /// Save a memory item to the store.
    func save(item: MemoryItem) async {
        queue.sync {
            // Remove existing item with same ID if present (upsert behavior)
            items.removeAll { $0.id == item.id }
            items.append(item)
        }
    }

    /// Fetch all stored memory items, sorted by index date (newest first).
    func fetchAll() async -> [MemoryItem] {
        queue.sync {
            items.sorted { $0.indexedAt > $1.indexedAt }
        }
    }

    /// Delete a memory item by its unique ID.
    /// Returns true if the item was found and deleted.
    func delete(id: UUID) async -> Bool {
        queue.sync {
            let countBefore = items.count
            items.removeAll { $0.id == id }
            return items.count < countBefore
        }
    }

    /// Clear all stored data.
    /// In production, this would DROP and recreate tables.
    func clearAll() async {
        queue.sync {
            items.removeAll()
        }
    }
}
