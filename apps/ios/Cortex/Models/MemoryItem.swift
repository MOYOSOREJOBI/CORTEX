/**
 * MemoryItem.swift
 * Represents a single indexed memory item in CORTEX.
 * Could be a photo, PDF, note, or any other content type.
 */

import Foundation

/// Content type categories for indexed memories.
enum MemoryContentType: String, Codable, CaseIterable {
    case photo = "Photo"
    case document = "Document"
    case note = "Note"
    case other = "Other"

    /// SF Symbol icon name for this content type.
    var iconName: String {
        switch self {
        case .photo: return "photo"
        case .document: return "doc.text"
        case .note: return "note.text"
        case .other: return "questionmark.folder"
        }
    }
}

/// A single indexed memory item with extracted content and metadata.
struct MemoryItem: Identifiable, Codable {
    /// Unique identifier for the memory
    let id: UUID

    /// Human-readable title (file name, note title, etc.)
    let title: String

    /// Extracted text content (OCR result, note body, etc.)
    let content: String

    /// Type of content this memory represents
    let contentType: MemoryContentType

    /// When this item was originally created
    let createdAt: Date

    /// When this item was last indexed by CORTEX
    let indexedAt: Date

    /// Optional file path on device (for photos/documents)
    let sourcePath: String?

    /// Embedding vector for semantic search (stored as array of floats)
    let embedding: [Float]?

    /// Creates a new MemoryItem with sensible defaults.
    init(
        id: UUID = UUID(),
        title: String,
        content: String,
        contentType: MemoryContentType,
        createdAt: Date = Date(),
        indexedAt: Date = Date(),
        sourcePath: String? = nil,
        embedding: [Float]? = nil
    ) {
        self.id = id
        self.title = title
        self.content = content
        self.contentType = contentType
        self.createdAt = createdAt
        self.indexedAt = indexedAt
        self.sourcePath = sourcePath
        self.embedding = embedding
    }
}
