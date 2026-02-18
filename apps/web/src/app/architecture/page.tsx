/**
 * Architecture page — "/architecture"
 * Describes the 4-layer CORTEX system architecture.
 * Uses the shared PageWrapper for consistent styling.
 */

import PageWrapper from '@/components/PageWrapper';

export const metadata = {
  title: 'Architecture — CORTEX',
  description: 'System architecture of the CORTEX on-device memory system.',
};

export default function ArchitecturePage() {
  return (
    <PageWrapper>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 600,
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #fff, #0066ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        System Architecture
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '15px' }}>
        A modular, 4-layer architecture designed for on-device intelligence.
      </p>

      {/* Architecture diagram */}
      <div
        style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.8',
          color: 'rgba(255,255,255,0.8)',
          overflowX: 'auto',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <pre style={{ margin: 0 }}>{`
┌─────────────────────────────────────────┐
│           UI Layer (SwiftUI)            │
│   ContentView · SearchView · Settings   │
├─────────────────────────────────────────┤
│         Domain Layer (Services)         │
│   IndexingService · SearchService       │
│   (Swift Actors — thread-safe)          │
├─────────────────────────────────────────┤
│          Engine Layer (ML/NLP)          │
│   Core ML · Vision OCR · NL NER        │
│   Embeddings · Vector Similarity        │
├─────────────────────────────────────────┤
│        Storage Layer (Persistent)       │
│   SQLite FTS5 · CryptoKit · Keychain   │
│   DatabaseManager · Encrypted Store     │
└─────────────────────────────────────────┘
        `}</pre>
      </div>

      {/* Layer descriptions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {[
          {
            title: 'UI Layer',
            tech: 'SwiftUI, iOS 17+',
            desc: 'Declarative views with tab-based navigation. SearchView provides real-time hybrid search with debounced input. SettingsView manages privacy controls and indexing preferences.',
          },
          {
            title: 'Domain Layer',
            tech: 'Swift Actors',
            desc: 'IndexingService and SearchService are implemented as Swift actors for safe concurrency. Protocol-oriented design with IndexingProtocol, SearchProtocol, and StorageProtocol for testability.',
          },
          {
            title: 'Engine Layer',
            tech: 'Core ML, Vision, NaturalLanguage',
            desc: 'On-device ML inference for content understanding. Vision framework handles OCR for images and PDFs. NaturalLanguage extracts named entities. Core ML generates embeddings for semantic search.',
          },
          {
            title: 'Storage Layer',
            tech: 'SQLite FTS5, CryptoKit',
            desc: 'Full-text search via SQLite FTS5 for keyword queries. Vector similarity search for semantic matching. All data encrypted at rest using CryptoKit with keys stored in Keychain.',
          },
        ].map((layer) => (
          <div
            key={layer.title}
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 4px' }}>
              {layer.title}
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: '#0066ff',
                margin: '0 0 8px',
                fontWeight: 500,
              }}
            >
              {layer.tech}
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
              {layer.desc}
            </p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
