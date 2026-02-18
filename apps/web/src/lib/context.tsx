'use client';

/**
 * Global app context for CORTEX.
 * Single source of truth for settings, memories, and UI state.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Memory, AppSettings, Toast, AnalyticsEvent, SearchHistoryEntry, ActivityEntry } from './types';
import * as db from './db';
import { DEFAULT_SETTINGS } from './constants';

interface AppContextValue {
  // Data
  memories: Memory[];
  settings: AppSettings;
  recentActivity: ActivityEntry[];
  // Data actions
  loadMemories: () => Promise<void>;
  addMemory: (memory: Memory) => Promise<void>;
  updateMemory: (memory: Memory) => Promise<void>;
  removeMemory: (id: string) => Promise<Memory | null>;
  restoreMemory: (memory: Memory) => Promise<void>;
  loadSettings: () => Promise<void>;
  saveSettings: (settings: AppSettings) => Promise<void>;
  addActivity: (action: string, detail: string) => void;
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => Promise<void>;
  addSearchEntry: (query: string, resultCount: number) => Promise<void>;
  // Toast
  toasts: Toast[];
  showToast: (type: Toast['type'], message: string, undoAction?: () => void) => void;
  dismissToast: (id: string) => void;
  // App lock
  locked: boolean;
  setLocked: (v: boolean) => void;
  // Loading
  ready: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ ...DEFAULT_SETTINGS });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [locked, setLocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([]);
  const activityRef = useRef<ActivityEntry[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const health = await db.checkStorageHealth();
        if (!health.ok) {
          console.error('Storage health check failed:', health.error);
        }
        const [mems, sett] = await Promise.all([db.getAllMemories(), db.getSettings()]);
        setMemories(mems);
        setSettings(sett);
        if (sett.appLockEnabled && sett.appLockVerifier) {
          setLocked(true);
        }
      } catch (err) {
        console.error('Failed to initialize database:', err);
      } finally {
        setReady(true);
      }
    }
    init();
  }, []);

  const loadMemories = useCallback(async () => {
    const mems = await db.getAllMemories();
    setMemories(mems);
  }, []);

  const addMemory = useCallback(async (memory: Memory) => {
    await db.putMemory(memory);
    setMemories((prev) => [memory, ...prev]);
  }, []);

  const updateMemory = useCallback(async (memory: Memory) => {
    await db.putMemory(memory);
    setMemories((prev) => prev.map((m) => (m.id === memory.id ? memory : m)));
  }, []);

  const removeMemory = useCallback(async (id: string): Promise<Memory | null> => {
    const mem = memories.find((m) => m.id === id) || null;
    if (mem) {
      await db.deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    }
    return mem;
  }, [memories]);

  const restoreMemory = useCallback(async (memory: Memory) => {
    await db.putMemory(memory);
    setMemories((prev) => [memory, ...prev]);
  }, []);

  const loadSettings = useCallback(async () => {
    const sett = await db.getSettings();
    setSettings(sett);
  }, []);

  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    await db.putSettings(newSettings);
    setSettings(newSettings);
  }, []);

  const addActivity = useCallback((action: string, detail: string) => {
    const entry: ActivityEntry = {
      id: db.generateId(),
      action,
      detail,
      timestamp: Date.now(),
    };
    activityRef.current = [entry, ...activityRef.current].slice(0, 50);
    setRecentActivity([...activityRef.current]);
  }, []);

  const trackEvent = useCallback(async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: db.generateId(),
      timestamp: Date.now(),
    };
    try {
      await db.addAnalyticsEvent(fullEvent);
    } catch {
      // Analytics failure should not block the user
    }
  }, []);

  const addSearchEntry = useCallback(async (query: string, resultCount: number) => {
    const entry: SearchHistoryEntry = {
      id: db.generateId(),
      query,
      resultCount,
      timestamp: Date.now(),
    };
    try {
      await db.addSearchHistory(entry);
    } catch {
      // Search history failure should not block the user
    }
  }, []);

  const showToast = useCallback((type: Toast['type'], message: string, undoAction?: () => void) => {
    const id = db.generateId();
    setToasts((prev) => [...prev, { id, type, message, undoAction }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        memories,
        settings,
        recentActivity,
        loadMemories,
        addMemory,
        updateMemory,
        removeMemory,
        restoreMemory,
        loadSettings,
        saveSettings,
        addActivity,
        trackEvent,
        addSearchEntry,
        toasts,
        showToast,
        dismissToast,
        locked,
        setLocked,
        ready,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
