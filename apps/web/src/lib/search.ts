/**
 * Hybrid search engine for CORTEX.
 * Combines keyword search and semantic similarity using Reciprocal Rank Fusion.
 */

import type { Memory, SearchResult } from './types';
import { RRF_K } from './constants';

/** Simple keyword tokenizer */
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

/** Build inverted index for keyword search */
export function buildKeywordIndex(memories: Memory[]): Map<string, Set<string>> {
  const index = new Map<string, Set<string>>();
  for (const mem of memories) {
    const tokens = new Set([
      ...tokenize(mem.title),
      ...tokenize(mem.body),
      ...mem.tags.map((t) => t.toLowerCase()),
    ]);
    for (const token of tokens) {
      if (!index.has(token)) {
        index.set(token, new Set());
      }
      index.get(token)!.add(mem.id);
    }
  }
  return index;
}

/** Keyword search with BM25 scoring */
function keywordSearch(
  query: string,
  memories: Memory[],
  index: Map<string, Set<string>>
): { id: string; score: number; hits: string[] }[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scores = new Map<string, { score: number; hits: string[] }>();
  const N = memories.length;

  for (const token of queryTokens) {
    const matchingIds = index.get(token);
    if (!matchingIds) continue;

    const idf = Math.log((N - matchingIds.size + 0.5) / (matchingIds.size + 0.5) + 1);

    for (const id of matchingIds) {
      const existing = scores.get(id) || { score: 0, hits: [] };
      existing.score += idf;
      if (!existing.hits.includes(token)) {
        existing.hits.push(token);
      }
      scores.set(id, existing);
    }
  }

  // Phrase matching bonus
  const queryLower = query.toLowerCase();
  for (const mem of memories) {
    const combined = `${mem.title} ${mem.body}`.toLowerCase();
    if (combined.includes(queryLower)) {
      const existing = scores.get(mem.id) || { score: 0, hits: [] };
      existing.score *= 1.5;
      scores.set(mem.id, existing);
    }
  }

  return Array.from(scores.entries())
    .map(([id, { score, hits }]) => ({ id, score, hits }))
    .sort((a, b) => b.score - a.score);
}

/** Cosine similarity between two vectors */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/** Simple bag of words embedding (fallback when no ML model) */
function simpleEmbed(text: string): number[] {
  const tokens = tokenize(text);
  const vec = new Array(128).fill(0);
  for (const token of tokens) {
    for (let i = 0; i < token.length; i++) {
      const idx = (token.charCodeAt(i) * 31 + i) % 128;
      vec[idx] += 1;
    }
  }
  const norm = Math.sqrt(vec.reduce((sum: number, v: number) => sum + v * v, 0));
  if (norm > 0) {
    for (let i = 0; i < vec.length; i++) vec[i] /= norm;
  }
  return vec;
}

/** Semantic search using simple embeddings */
function semanticSearch(
  query: string,
  memories: Memory[]
): { id: string; score: number }[] {
  const queryEmbed = simpleEmbed(query);
  return memories
    .map((mem) => {
      const memEmbed = simpleEmbed(`${mem.title} ${mem.body} ${mem.tags.join(' ')}`);
      return { id: mem.id, score: cosineSimilarity(queryEmbed, memEmbed) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Reciprocal Rank Fusion.
 * Merges two ranked lists using RRF with k = 60.
 */
export function reciprocalRankFusion(
  keywordResults: { id: string; score: number }[],
  semanticResults: { id: string; score: number }[],
  k: number = RRF_K
): { id: string; score: number; keywordRank: number; semanticRank: number }[] {
  const scores = new Map<string, { score: number; keywordRank: number; semanticRank: number }>();

  keywordResults.forEach((r, rank) => {
    const existing = scores.get(r.id) || { score: 0, keywordRank: -1, semanticRank: -1 };
    existing.score += 1 / (k + rank + 1);
    existing.keywordRank = rank + 1;
    scores.set(r.id, existing);
  });

  semanticResults.forEach((r, rank) => {
    const existing = scores.get(r.id) || { score: 0, keywordRank: -1, semanticRank: -1 };
    existing.score += 1 / (k + rank + 1);
    existing.semanticRank = rank + 1;
    scores.set(r.id, existing);
  });

  return Array.from(scores.entries())
    .map(([id, { score, keywordRank, semanticRank }]) => ({ id, score, keywordRank, semanticRank }))
    .sort((a, b) => b.score - a.score);
}

/** Recency boost: newer memories score higher */
function recencyBoost(createdAt: number): number {
  const ageMs = Date.now() - createdAt;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - ageDays / 365);
}

/** Tag match boost */
function tagMatchBoost(queryTokens: string[], tags: string[]): number {
  const lowerTags = tags.map((t) => t.toLowerCase());
  let matches = 0;
  for (const token of queryTokens) {
    if (lowerTags.some((tag) => tag.includes(token))) {
      matches++;
    }
  }
  return matches > 0 ? 0.1 * matches : 0;
}

/** Date filter */
function matchesDateFilter(memory: Memory, dateFrom?: number, dateTo?: number): boolean {
  if (dateFrom && memory.createdAt < dateFrom) return false;
  if (dateTo && memory.createdAt > dateTo) return false;
  return true;
}

/** Tag filter */
function matchesTagFilter(memory: Memory, filterTags?: string[]): boolean {
  if (!filterTags || filterTags.length === 0) return true;
  return filterTags.some((ft) =>
    memory.tags.some((mt) => mt.toLowerCase() === ft.toLowerCase())
  );
}

export interface SearchOptions {
  filterTags?: string[];
  dateFrom?: number;
  dateTo?: number;
}

/**
 * Hybrid search combining keyword and semantic search.
 * Returns results ranked by RRF with recency and tag boosts.
 */
export function hybridSearch(
  query: string,
  memories: Memory[],
  keywordIndex: Map<string, Set<string>>,
  options?: SearchOptions
): SearchResult[] {
  if (!query.trim()) return [];

  let filtered = memories;
  if (options?.filterTags || options?.dateFrom || options?.dateTo) {
    filtered = memories.filter(
      (m) =>
        matchesDateFilter(m, options?.dateFrom, options?.dateTo) &&
        matchesTagFilter(m, options?.filterTags)
    );
  }

  const kwResults = keywordSearch(query, filtered, keywordIndex);
  const semResults = semanticSearch(query, filtered);
  const fused = reciprocalRankFusion(kwResults, semResults);

  const queryTokens = tokenize(query);
  const memoryMap = new Map(filtered.map((m) => [m.id, m]));
  const kwMap = new Map(kwResults.map((r) => [r.id, r]));

  return fused
    .map((r) => {
      const memory = memoryMap.get(r.id);
      if (!memory) return null;

      const kwEntry = kwMap.get(r.id);
      const kwScore = kwEntry?.score || 0;
      const semEntry = semResults.find((s) => s.id === r.id);
      const semScore = semEntry?.score || 0;
      const recency = recencyBoost(memory.createdAt);
      const tagBoost_ = tagMatchBoost(queryTokens, memory.tags);

      return {
        memory,
        score: r.score + recency * 0.05 + tagBoost_,
        keywordScore: kwScore,
        semanticScore: semScore,
        recencyBoost: recency,
        tagBoost: tagBoost_,
        keywordHits: kwEntry?.hits || [],
      } satisfies SearchResult;
    })
    .filter((r): r is SearchResult => r !== null)
    .sort((a, b) => b.score - a.score);
}
