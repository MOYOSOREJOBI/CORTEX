/**
 * App-wide constants for CORTEX.
 * Centralizes sidebar items, stat cards, and default values.
 */

import { MenuItem, StatCard } from './types';

/** Sidebar navigation items */
export const MENU_ITEMS: MenuItem[] = [
  { icon: 'fas fa-brain', label: 'Dashboard', description: 'Main overview' },
  { icon: 'fas fa-search', label: 'Search', description: 'Hybrid semantic search' },
  { icon: 'fas fa-layer-group', label: 'Memories', description: 'Indexed memory items' },
  { icon: 'fas fa-microchip', label: 'Processing', description: 'Indexing pipeline status' },
  { icon: 'fas fa-shield-halved', label: 'Privacy', description: 'Privacy controls' },
  { icon: 'fas fa-chart-line', label: 'Analytics', description: 'Performance analytics' },
];

/** Dashboard stat card configurations */
export const STAT_CARDS: StatCard[] = [
  { icon: 'fas fa-brain', key: 'memoriesIndexed', label: 'Memories Indexed', defaultValue: '2,847' },
  { icon: 'fas fa-bolt', key: 'searchQueries', label: 'Search Queries', defaultValue: '156' },
  { icon: 'fas fa-shield-halved', key: 'privacyScore', label: 'Privacy Score', defaultValue: '98%' },
];

/** Default user profile (used as fallback if API fails) */
export const DEFAULT_USER = {
  name: 'Moyosore Jobi',
  role: 'Software Engineer',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
};

/** Navigation links used across the site */
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Demo' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/benchmarks', label: 'Benchmarks' },
  { href: '/build', label: 'Tech Stack' },
];
