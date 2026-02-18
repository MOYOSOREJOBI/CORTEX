/**
 * TypeScript interfaces for CORTEX.
 */

/** Memory record stored in IndexedDB */
export interface Memory {
  id: string;
  title: string;
  body: string;
  tags: string[];
  source: 'manual' | 'import' | 'capture';
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  sensitivity: 'normal' | 'sensitive' | 'restricted';
}

/** Search history entry */
export interface SearchHistoryEntry {
  id: string;
  query: string;
  resultCount: number;
  timestamp: number;
}

/** Index run record */
export interface IndexRun {
  id: string;
  status: 'running' | 'paused' | 'completed' | 'cancelled' | 'error';
  docsProcessed: number;
  totalDocs: number;
  startedAt: number;
  completedAt: number | null;
  durationMs: number | null;
  error: string | null;
}

/** Analytics event */
export interface AnalyticsEvent {
  id: string;
  type: 'search' | 'add_memory' | 'edit_memory' | 'delete_memory' | 'export' | 'import' | 'index_run' | 'app_lock' | 'wipe';
  detail: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/** App settings */
export interface AppSettings {
  id: string;
  appLockEnabled: boolean;
  appLockVerifier: string | null;
  appLockSalt: string | null;
  reduceMotion: boolean;
  noRemoteAssets: boolean;
  localAnalytics: boolean;
  schemaVersion: number;
}

/** Dashboard statistics */
export interface DashboardStats {
  memoriesIndexed: number;
  searchQueries: number;
  privacyScore: number;
}

/** User profile */
export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}

/** Sidebar menu item configuration */
export interface MenuItem {
  icon: string;
  label: string;
  description: string;
  route: string;
  shortcut: string;
}

/** Stat card configuration */
export interface StatCard {
  icon: string;
  key: keyof DashboardStats;
  label: string;
  defaultValue: string;
}

/** Search result with explainability */
export interface SearchResult {
  memory: Memory;
  score: number;
  keywordScore: number;
  semanticScore: number;
  recencyBoost: number;
  tagBoost: number;
  keywordHits: string[];
}

/** Export vault envelope */
export interface VaultExport {
  version: number;
  exportedAt: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

/** Recent activity entry */
export interface ActivityEntry {
  id: string;
  action: string;
  detail: string;
  timestamp: number;
}

/** Toast notification */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  undoAction?: () => void;
}
