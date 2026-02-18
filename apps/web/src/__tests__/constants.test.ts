import { describe, it, expect } from 'vitest';
import { MENU_ITEMS, STAT_CARDS, DEFAULT_USER, DB_NAME, DB_VERSION, STORES } from '@/lib/constants';

describe('constants', () => {
  it('has 7 menu items including About', () => {
    expect(MENU_ITEMS.length).toBe(7);
    const labels = MENU_ITEMS.map((i) => i.label);
    expect(labels).toContain('Dashboard');
    expect(labels).toContain('Search');
    expect(labels).toContain('Memories');
    expect(labels).toContain('Processing');
    expect(labels).toContain('Privacy');
    expect(labels).toContain('Analytics');
    expect(labels).toContain('About');
  });

  it('each menu item has required fields', () => {
    for (const item of MENU_ITEMS) {
      expect(item.icon).toBeTruthy();
      expect(item.label).toBeTruthy();
      expect(item.route).toBeTruthy();
      expect(item.shortcut).toBeTruthy();
    }
  });

  it('has 3 stat cards', () => {
    expect(STAT_CARDS.length).toBe(3);
  });

  it('default user is Moyosore Jobi', () => {
    expect(DEFAULT_USER.name).toBe('Moyosore Jobi');
    expect(DEFAULT_USER.role).toBe('Software Engineer');
    expect(DEFAULT_USER.avatarUrl).toBe('/profile-avatar.jpg');
  });

  it('database constants are set', () => {
    expect(DB_NAME).toBe('cortex');
    expect(DB_VERSION).toBe(1);
    expect(STORES.memories).toBe('memories');
    expect(STORES.searchHistory).toBe('searchHistory');
    expect(STORES.indexRuns).toBe('indexRuns');
    expect(STORES.analyticsEvents).toBe('analyticsEvents');
    expect(STORES.settings).toBe('settings');
  });
});
