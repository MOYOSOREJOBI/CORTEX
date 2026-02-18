/**
 * App constants for CORTEX.
 */

import { MenuItem, StatCard, UserProfile } from './types';

/** Sidebar navigation items */
export const MENU_ITEMS: MenuItem[] = [
  { icon: 'fas fa-brain', label: 'Dashboard', description: 'Main overview', route: 'dashboard', shortcut: 'Ctrl+1' },
  { icon: 'fas fa-search', label: 'Search', description: 'Hybrid semantic search', route: 'search', shortcut: 'Ctrl+2' },
  { icon: 'fas fa-layer-group', label: 'Memories', description: 'Stored memories', route: 'memories', shortcut: 'Ctrl+3' },
  { icon: 'fas fa-microchip', label: 'Processing', description: 'Indexing pipeline', route: 'processing', shortcut: 'Ctrl+4' },
  { icon: 'fas fa-shield-halved', label: 'Privacy', description: 'Privacy controls', route: 'privacy', shortcut: 'Ctrl+5' },
  { icon: 'fas fa-chart-line', label: 'Analytics', description: 'Local analytics', route: 'analytics', shortcut: 'Ctrl+6' },
  { icon: 'fas fa-circle-info', label: 'About', description: 'About Cortex', route: 'about', shortcut: 'Ctrl+7' },
];

/** Dashboard stat card configurations */
export const STAT_CARDS: StatCard[] = [
  { icon: 'fas fa-brain', key: 'memoriesIndexed', label: 'Memories Indexed', defaultValue: '0' },
  { icon: 'fas fa-bolt', key: 'searchQueries', label: 'Search Queries', defaultValue: '0' },
  { icon: 'fas fa-shield-halved', key: 'privacyScore', label: 'Privacy Score', defaultValue: '0' },
];

/** Default user profile */
export const DEFAULT_USER: UserProfile = {
  name: 'Moyosore Jobi',
  role: 'Software Engineer',
  avatarUrl: '/profile-avatar.jpg',
};

/** IndexedDB database name */
export const DB_NAME = 'cortex';

/** IndexedDB schema version */
export const DB_VERSION = 1;

/** Store names */
export const STORES = {
  memories: 'memories',
  searchHistory: 'searchHistory',
  indexRuns: 'indexRuns',
  analyticsEvents: 'analyticsEvents',
  settings: 'settings',
} as const;

/** Default settings */
export const DEFAULT_SETTINGS = {
  id: 'app-settings',
  appLockEnabled: false,
  appLockVerifier: null,
  appLockSalt: null,
  reduceMotion: false,
  noRemoteAssets: false,
  localAnalytics: true,
  schemaVersion: 1,
};

/** Max tag length */
export const MAX_TAG_LENGTH = 50;

/** Max tags per memory */
export const MAX_TAGS_PER_MEMORY = 20;

/** Max title length */
export const MAX_TITLE_LENGTH = 200;

/** Debounce delay for search (ms) */
export const SEARCH_DEBOUNCE_MS = 200;

/** Debounce delay for autosave (ms) */
export const AUTOSAVE_DEBOUNCE_MS = 1000;

/** RRF k constant */
export const RRF_K = 60;
