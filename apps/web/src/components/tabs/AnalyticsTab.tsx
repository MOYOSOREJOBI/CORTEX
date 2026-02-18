'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/context';
import * as db from '@/lib/db';
import type { AnalyticsEvent, SearchHistoryEntry } from '@/lib/types';

export default function AnalyticsTab() {
  const { memories, settings } = useApp();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [evts, sh] = await Promise.all([
        db.getAnalyticsEvents(),
        db.getSearchHistory(),
      ]);
      setEvents(evts);
      setSearchHistory(sh);
    } catch {
      // Silently handle errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute metrics
  const searchEvents = events.filter((e) => e.type === 'search');
  const searchLatencies = searchEvents
    .map((e) => (e.metadata?.durationMs as number) || 0)
    .filter((d) => d > 0)
    .sort((a, b) => a - b);

  const p50 = searchLatencies.length > 0
    ? searchLatencies[Math.floor(searchLatencies.length * 0.5)]
    : 0;
  const p95 = searchLatencies.length > 0
    ? searchLatencies[Math.floor(searchLatencies.length * 0.95)]
    : 0;

  const indexEvents = events.filter((e) => e.type === 'index_run');
  const indexDurations = indexEvents
    .map((e) => (e.metadata?.durationMs as number) || 0)
    .filter((d) => d > 0);
  const avgIndexDuration = indexDurations.length > 0
    ? indexDurations.reduce((a, b) => a + b, 0) / indexDurations.length
    : 0;

  // Top tags
  const tagCounts = new Map<string, number>();
  for (const mem of memories) {
    for (const tag of mem.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }
  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Recent queries
  const recentQueries = searchHistory.slice(0, 10);

  // Export
  const handleExportCSV = () => {
    const rows = [
      ['Type', 'Detail', 'Timestamp'],
      ...events.map((e) => [e.type, e.detail, new Date(e.timestamp).toISOString()]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cortex-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cortex-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 20,
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const btnStyle: React.CSSProperties = {
    padding: '8px 14px',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  if (!settings.localAnalytics) {
    return (
      <>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px' }}>Analytics</h1>
        </header>
        <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
          <i className="fas fa-chart-line" style={{ fontSize: 32, opacity: 0.4, marginBottom: 12, display: 'block' }} />
          <p style={{ opacity: 0.6 }}>Analytics are disabled. Enable local analytics in Privacy settings to see metrics.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <header style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px' }}>Analytics</h1>
            <p style={{ opacity: 0.7, fontSize: 14, margin: 0 }}>Local metrics only. Nothing leaves this device.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleExportCSV} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)' }}>
              <i className="fas fa-download" style={{ marginRight: 4 }} /> CSV
            </button>
            <button onClick={handleExportJSON} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)' }}>
              <i className="fas fa-download" style={{ marginRight: 4 }} /> JSON
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <p style={{ opacity: 0.6 }}>Loading analytics...</p>
      ) : (
        <>
          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Search p50', value: `${p50.toFixed(1)}ms` },
              { label: 'Search p95', value: `${p95.toFixed(1)}ms` },
              { label: 'Avg Index Time', value: avgIndexDuration > 0 ? `${(avgIndexDuration / 1000).toFixed(1)}s` : 'N/A' },
              { label: 'Memory Count', value: memories.length.toString() },
              { label: 'Total Events', value: events.length.toString() },
              { label: 'Total Searches', value: searchHistory.length.toString() },
            ].map((m) => (
              <div key={m.label} style={cardStyle}>
                <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{m.value}</p>
                <p style={{ fontSize: 13, opacity: 0.6, margin: '4px 0 0' }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Top Tags */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Top Tags</h2>
            {topTags.length === 0 ? (
              <p style={{ opacity: 0.5, fontSize: 13 }}>No tags yet.</p>
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {topTags.map(([tag, count]) => (
                  <span key={tag} style={{
                    padding: '4px 12px',
                    background: 'rgba(0,102,255,0.2)',
                    borderRadius: 8,
                    fontSize: 13,
                  }}>
                    {tag} ({count})
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recent Queries */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Recent Queries</h2>
            {recentQueries.length === 0 ? (
              <p style={{ opacity: 0.5, fontSize: 13 }}>No search queries recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recentQueries.map((q) => (
                  <div key={q.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 13,
                  }}>
                    <span>&quot;{q.query}&quot; ({q.resultCount} results)</span>
                    <span style={{ opacity: 0.4, fontSize: 11 }}>{new Date(q.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
