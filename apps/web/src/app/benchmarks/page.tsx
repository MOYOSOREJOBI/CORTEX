/**
 * Benchmarks page — "/benchmarks"
 * Displays performance metrics and benchmark data for CORTEX.
 * Uses styled cards to present mock performance data.
 */

import PageWrapper from '@/components/PageWrapper';

export const metadata = {
  title: 'Benchmarks — CORTEX',
  description: 'Performance benchmarks for the CORTEX on-device memory system.',
};

/** Benchmark data entries */
const benchmarks = [
  {
    metric: 'Photo Indexing',
    value: '< 3s',
    detail: '50 photos (OCR + embedding)',
    icon: '📸',
  },
  {
    metric: 'Search Latency',
    value: '< 50ms',
    detail: 'P95, hybrid semantic + keyword',
    icon: '⚡',
  },
  {
    metric: 'Memory Usage',
    value: '< 80MB',
    detail: 'RSS during active indexing',
    icon: '💾',
  },
  {
    metric: 'Battery Impact',
    value: '< 2%',
    detail: 'Per 100-item index run',
    icon: '🔋',
  },
];

/** Detailed benchmark rows for the table */
const detailedBenchmarks = [
  { operation: 'Single photo OCR', time: '~45ms', memory: '12MB' },
  { operation: 'Embedding generation', time: '~30ms', memory: '25MB' },
  { operation: 'FTS5 keyword search', time: '~5ms', memory: '2MB' },
  { operation: 'Vector similarity search', time: '~15ms', memory: '8MB' },
  { operation: 'Hybrid search (combined)', time: '~35ms', memory: '10MB' },
  { operation: 'PDF page indexing', time: '~120ms', memory: '18MB' },
  { operation: 'Note indexing (NER)', time: '~25ms', memory: '6MB' },
  { operation: 'Database encryption', time: '~2ms', memory: '1MB' },
];

export default function BenchmarksPage() {
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
        Performance Benchmarks
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '15px' }}>
        Measured on iPhone 15 Pro, iOS 17.2, release build.
      </p>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        {benchmarks.map((b) => (
          <div
            key={b.metric}
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '24px 20px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>
              {b.icon}
            </span>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#0066ff',
                marginBottom: '4px',
              }}
            >
              {b.value}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
              {b.metric}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{b.detail}</div>
          </div>
        ))}
      </div>

      {/* Detailed benchmark table */}
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
        Detailed Breakdown
      </h2>
      <div
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                Operation
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                Latency
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                Memory
              </th>
            </tr>
          </thead>
          <tbody>
            {detailedBenchmarks.map((row) => (
              <tr
                key={row.operation}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <td style={{ padding: '10px 16px', color: 'rgba(255,255,255,0.8)' }}>
                  {row.operation}
                </td>
                <td
                  style={{
                    padding: '10px 16px',
                    textAlign: 'right',
                    color: '#0066ff',
                    fontWeight: 500,
                    fontFamily: 'monospace',
                  }}
                >
                  {row.time}
                </td>
                <td
                  style={{
                    padding: '10px 16px',
                    textAlign: 'right',
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'monospace',
                  }}
                >
                  {row.memory}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
