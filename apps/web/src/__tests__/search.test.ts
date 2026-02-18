import { describe, it, expect } from 'vitest';
import { buildKeywordIndex, hybridSearch, reciprocalRankFusion } from '@/lib/search';
import type { Memory } from '@/lib/types';

function makeMemory(overrides: Partial<Memory> & { id: string; title: string; body: string }): Memory {
  return {
    tags: [],
    source: 'manual',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pinned: false,
    sensitivity: 'normal',
    ...overrides,
  };
}

describe('buildKeywordIndex', () => {
  it('builds index from memories', () => {
    const memories = [
      makeMemory({ id: '1', title: 'Hello world', body: 'This is a test' }),
      makeMemory({ id: '2', title: 'Goodbye', body: 'Another test document' }),
    ];
    const index = buildKeywordIndex(memories);
    expect(index.get('hello')?.has('1')).toBe(true);
    expect(index.get('test')?.has('1')).toBe(true);
    expect(index.get('test')?.has('2')).toBe(true);
    expect(index.get('goodbye')?.has('2')).toBe(true);
  });

  it('indexes tags', () => {
    const memories = [
      makeMemory({ id: '1', title: 'Note', body: 'Content', tags: ['javascript', 'react'] }),
    ];
    const index = buildKeywordIndex(memories);
    expect(index.get('javascript')?.has('1')).toBe(true);
    expect(index.get('react')?.has('1')).toBe(true);
  });

  it('handles empty memories', () => {
    const index = buildKeywordIndex([]);
    expect(index.size).toBe(0);
  });
});

describe('reciprocalRankFusion', () => {
  it('merges two ranked lists', () => {
    const keywordResults = [
      { id: 'a', score: 3 },
      { id: 'b', score: 2 },
      { id: 'c', score: 1 },
    ];
    const semanticResults = [
      { id: 'b', score: 0.9 },
      { id: 'a', score: 0.7 },
      { id: 'd', score: 0.5 },
    ];
    const results = reciprocalRankFusion(keywordResults, semanticResults, 60);

    // Results should be deterministic
    expect(results.length).toBe(4);
    // a and b should rank highest (appear in both lists)
    const topIds = results.slice(0, 2).map((r) => r.id);
    expect(topIds).toContain('a');
    expect(topIds).toContain('b');
  });

  it('returns deterministic results for same input', () => {
    const kw = [{ id: 'x', score: 5 }, { id: 'y', score: 3 }];
    const sem = [{ id: 'y', score: 0.8 }, { id: 'x', score: 0.6 }];
    const r1 = reciprocalRankFusion(kw, sem, 60);
    const r2 = reciprocalRankFusion(kw, sem, 60);
    expect(r1.map((r) => r.id)).toEqual(r2.map((r) => r.id));
    expect(r1.map((r) => r.score)).toEqual(r2.map((r) => r.score));
  });

  it('handles empty lists', () => {
    const results = reciprocalRankFusion([], [], 60);
    expect(results).toEqual([]);
  });

  it('handles single list empty', () => {
    const kw = [{ id: 'a', score: 1 }];
    const results = reciprocalRankFusion(kw, [], 60);
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('a');
  });

  it('uses k parameter correctly', () => {
    const kw = [{ id: 'a', score: 1 }];
    const r60 = reciprocalRankFusion(kw, [], 60);
    const r10 = reciprocalRankFusion(kw, [], 10);
    // With k=10, score = 1/(10+1) = 0.0909
    // With k=60, score = 1/(60+1) = 0.0164
    expect(r10[0].score).toBeGreaterThan(r60[0].score);
  });
});

describe('hybridSearch', () => {
  const memories = [
    makeMemory({ id: '1', title: 'JavaScript basics', body: 'Learn JavaScript programming fundamentals', tags: ['javascript', 'programming'] }),
    makeMemory({ id: '2', title: 'React hooks guide', body: 'Guide to React hooks and state management', tags: ['react', 'javascript'] }),
    makeMemory({ id: '3', title: 'Python tutorial', body: 'Introduction to Python language', tags: ['python'] }),
  ];
  const index = buildKeywordIndex(memories);

  it('finds results for keyword query', () => {
    const results = hybridSearch('javascript', memories, index);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].memory.id).toBe('1');
  });

  it('returns empty for empty query', () => {
    const results = hybridSearch('', memories, index);
    expect(results.length).toBe(0);
  });

  it('returns empty for whitespace query', () => {
    const results = hybridSearch('   ', memories, index);
    expect(results.length).toBe(0);
  });

  it('includes keyword hits in results', () => {
    const results = hybridSearch('javascript', memories, index);
    const hit = results.find((r) => r.memory.id === '1');
    expect(hit).toBeDefined();
    expect(hit!.keywordHits).toContain('javascript');
  });

  it('includes scores in results', () => {
    const results = hybridSearch('react hooks', memories, index);
    const hit = results.find((r) => r.memory.id === '2');
    expect(hit).toBeDefined();
    expect(hit!.score).toBeGreaterThan(0);
    expect(hit!.keywordScore).toBeGreaterThanOrEqual(0);
    expect(hit!.semanticScore).toBeGreaterThanOrEqual(0);
    expect(hit!.recencyBoost).toBeGreaterThanOrEqual(0);
  });

  it('filters by tags', () => {
    const results = hybridSearch('programming', memories, index, { filterTags: ['python'] });
    const ids = results.map((r) => r.memory.id);
    expect(ids).not.toContain('1');
  });

  it('returns low scores for unmatched query', () => {
    const results = hybridSearch('zzzznonexistent', memories, index);
    // Semantic search may return low-score matches even for nonsense queries.
    // Keyword hits should be empty for all results.
    for (const r of results) {
      expect(r.keywordHits.length).toBe(0);
    }
  });
});
