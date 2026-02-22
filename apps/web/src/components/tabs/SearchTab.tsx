'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { hybridSearch, buildKeywordIndex } from '@/lib/search';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import type { SearchResult } from '@/lib/types';

export default function SearchTab() {
  const { memories, addSearchEntry, addActivity, trackEvent, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef<Map<string, Set<string>>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    indexRef.current = buildKeywordIndex(memories);
  }, [memories]);

  // Auto-focus search input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearchTime(null);
      return;
    }
    setSearching(true);
    const start = performance.now();
    const filterTags = tagFilter.trim() ? tagFilter.split(',').map((t) => t.trim()).filter(Boolean) : undefined;
    const res = hybridSearch(q, memories, indexRef.current, { filterTags });
    const duration = performance.now() - start;
    setResults(res);
    setSearchTime(duration);
    setSearching(false);
    addSearchEntry(q, res.length).catch(() => {});
    addActivity('Search', `"${q}" found ${res.length} results`);
    trackEvent({ type: 'search', detail: q, metadata: { resultCount: res.length, durationMs: duration } });
  }, [memories, tagFilter, addSearchEntry, addActivity, trackEvent]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), SEARCH_DEBOUNCE_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doSearch(query);
  };

  const highlightText = (text: string, hits: string[]) => {
    if (hits.length === 0) return text;
    const pattern = hits.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ background: 'rgba(0,102,255,0.4)', color: '#fff', borderRadius: 2, padding: '0 2px' }}>{part}</mark>
      ) : part
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('success', 'Copied to clipboard.');
    });
  };

  return (
    <>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px' }}>Search</h1>
        <p style={{ opacity: 0.7, fontSize: 14, margin: 0 }}>Find memories using hybrid keyword and semantic search.</p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="fas fa-search" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, opacity: 0.4,
          }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search memories..."
            aria-label="Search memories"
            style={{
              width: '100%', padding: '12px 16px 12px 38px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
        <button type="submit" style={{
          padding: '12px 20px', background: '#0066ff', border: 'none', borderRadius: 12,
          color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }} aria-label="Run search">
          Search
        </button>
      </form>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}
          placeholder="Filter by tags (comma separated)" aria-label="Filter by tags"
          style={{
            flex: 1, minWidth: 180, padding: '8px 14px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff',
            fontSize: 13, outline: 'none', fontFamily: 'inherit',
          }}
        />
        {searchTime !== null && results.length > 0 && (
          <span style={{ fontSize: 12, opacity: 0.4, whiteSpace: 'nowrap' }}>
            {results.length} results in {searchTime.toFixed(1)}ms
          </span>
        )}
      </div>

      {searching && <p style={{ opacity: 0.6 }}>Searching...</p>}

      {!searching && query && results.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <i className="fas fa-search" style={{ fontSize: 36, opacity: 0.25, marginBottom: 14, display: 'block' }} />
          <p style={{ opacity: 0.5, fontSize: 15, margin: '0 0 6px' }}>No results found for &quot;{query}&quot;</p>
          <p style={{ opacity: 0.35, fontSize: 13, margin: 0 }}>Try different keywords or check your tag filters.</p>
        </div>
      )}

      {!query && results.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <i className="fas fa-magnifying-glass" style={{ fontSize: 36, opacity: 0.25, marginBottom: 14, display: 'block' }} />
          <p style={{ opacity: 0.5, fontSize: 15, margin: '0 0 6px' }}>Type a query to search your memories.</p>
          <p style={{ opacity: 0.35, fontSize: 13, margin: 0 }}>
            {memories.length === 0 ? 'Add some memories first, then search them here.' : `${memories.length} memories available for search.`}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results.map((r, idx) => (
          <div
            key={r.memory.id}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: 18, cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onClick={() => setExpandedId(expandedId === r.memory.id ? null : r.memory.id)}
            role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expandedId === r.memory.id ? null : r.memory.id); } }}
            aria-expanded={expandedId === r.memory.id}
            aria-label={`Search result: ${r.memory.title}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,102,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 600, flexShrink: 0, color: '#6eb4ff',
                }}>{idx + 1}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                  {highlightText(r.memory.title, r.keywordHits)}
                </h3>
                {r.memory.pinned && <i className="fas fa-thumbtack" style={{ fontSize: 10, color: '#0066ff' }} />}
              </div>
              <span style={{ fontSize: 11, opacity: 0.4, whiteSpace: 'nowrap' }}>
                {r.score.toFixed(3)}
              </span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.7, margin: '8px 0', lineHeight: 1.5, paddingLeft: 30 }}>
              {highlightText(
                r.memory.body.length > 200 ? r.memory.body.slice(0, 200) + '...' : r.memory.body,
                r.keywordHits
              )}
            </p>
            {r.memory.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4, paddingLeft: 30 }}>
                {r.memory.tags.map((tag) => (
                  <span key={tag} style={{ padding: '2px 8px', background: 'rgba(0,102,255,0.2)', borderRadius: 6, fontSize: 11 }}>{tag}</span>
                ))}
              </div>
            )}

            {expandedId === r.memory.id && (
              <div style={{
                marginTop: 14, padding: 14, background: 'rgba(255,255,255,0.04)',
                borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', marginLeft: 30,
              }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, opacity: 0.9 }}>Why this matched</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                  <div><span style={{ opacity: 0.5 }}>Keyword hits:</span> {r.keywordHits.length > 0 ? r.keywordHits.join(', ') : 'None'}</div>
                  <div><span style={{ opacity: 0.5 }}>Semantic:</span> {r.semanticScore.toFixed(3)}</div>
                  <div><span style={{ opacity: 0.5 }}>Recency:</span> {(r.recencyBoost * 100).toFixed(0)}%</div>
                  <div><span style={{ opacity: 0.5 }}>Tag boost:</span> {r.tagBoost.toFixed(3)}</div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(r.memory.body); }}
                    style={{
                      padding: '6px 12px', background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                      color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                    aria-label="Copy body text"
                  >
                    <i className="fas fa-copy" style={{ marginRight: 4 }} /> Copy Body
                  </button>
                  <span style={{ fontSize: 11, opacity: 0.3, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                    {new Date(r.memory.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
