/**
 * IndexedDB database layer for CORTEX.
 * Provides typed access to all stores with atomic transactions.
 */

import { DB_NAME, DB_VERSION, STORES, DEFAULT_SETTINGS } from './constants';
import type { Memory, SearchHistoryEntry, IndexRun, AnalyticsEvent, AppSettings, ActivityEntry } from './types';

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.memories)) {
        const memStore = db.createObjectStore(STORES.memories, { keyPath: 'id' });
        memStore.createIndex('createdAt', 'createdAt');
        memStore.createIndex('updatedAt', 'updatedAt');
        memStore.createIndex('pinned', 'pinned');
      }

      if (!db.objectStoreNames.contains(STORES.searchHistory)) {
        const shStore = db.createObjectStore(STORES.searchHistory, { keyPath: 'id' });
        shStore.createIndex('timestamp', 'timestamp');
      }

      if (!db.objectStoreNames.contains(STORES.indexRuns)) {
        const irStore = db.createObjectStore(STORES.indexRuns, { keyPath: 'id' });
        irStore.createIndex('startedAt', 'startedAt');
      }

      if (!db.objectStoreNames.contains(STORES.analyticsEvents)) {
        const aeStore = db.createObjectStore(STORES.analyticsEvents, { keyPath: 'id' });
        aeStore.createIndex('timestamp', 'timestamp');
        aeStore.createIndex('type', 'type');
      }

      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.activity)) {
        const actStore = db.createObjectStore(STORES.activity, { keyPath: 'id' });
        actStore.createIndex('timestamp', 'timestamp');
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      dbInstance.onclose = () => { dbInstance = null; };
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB. Check browser storage permissions.'));
    };
  });
}

function tx(
  storeName: string,
  mode: IDBTransactionMode
): Promise<{ store: IDBObjectStore; complete: Promise<void> }> {
  return openDB().then((db) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const complete = new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(new Error('Transaction aborted'));
    });
    return { store, complete };
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Memories

export async function getAllMemories(): Promise<Memory[]> {
  const { store, complete } = await tx(STORES.memories, 'readonly');
  const result = await requestToPromise(store.getAll());
  await complete;
  return result;
}

export async function getMemory(id: string): Promise<Memory | undefined> {
  const { store, complete } = await tx(STORES.memories, 'readonly');
  const result = await requestToPromise(store.get(id));
  await complete;
  return result;
}

export async function putMemory(memory: Memory): Promise<void> {
  const { store, complete } = await tx(STORES.memories, 'readwrite');
  store.put(memory);
  await complete;
}

export async function deleteMemory(id: string): Promise<void> {
  const { store, complete } = await tx(STORES.memories, 'readwrite');
  store.delete(id);
  await complete;
}

export async function countMemories(): Promise<number> {
  const { store, complete } = await tx(STORES.memories, 'readonly');
  const count = await requestToPromise(store.count());
  await complete;
  return count;
}

export async function clearMemories(): Promise<void> {
  const { store, complete } = await tx(STORES.memories, 'readwrite');
  store.clear();
  await complete;
}

// Search History

export async function addSearchHistory(entry: SearchHistoryEntry): Promise<void> {
  const { store, complete } = await tx(STORES.searchHistory, 'readwrite');
  store.put(entry);
  await complete;
}

export async function getSearchHistory(): Promise<SearchHistoryEntry[]> {
  const { store, complete } = await tx(STORES.searchHistory, 'readonly');
  const result = await requestToPromise(store.getAll());
  await complete;
  return result.sort((a: SearchHistoryEntry, b: SearchHistoryEntry) => b.timestamp - a.timestamp);
}

export async function countSearchHistory(): Promise<number> {
  const { store, complete } = await tx(STORES.searchHistory, 'readonly');
  const count = await requestToPromise(store.count());
  await complete;
  return count;
}

export async function clearSearchHistory(): Promise<void> {
  const { store, complete } = await tx(STORES.searchHistory, 'readwrite');
  store.clear();
  await complete;
}

// Index Runs

export async function addIndexRun(run: IndexRun): Promise<void> {
  const { store, complete } = await tx(STORES.indexRuns, 'readwrite');
  store.put(run);
  await complete;
}

export async function getIndexRuns(): Promise<IndexRun[]> {
  const { store, complete } = await tx(STORES.indexRuns, 'readonly');
  const result = await requestToPromise(store.getAll());
  await complete;
  return result.sort((a: IndexRun, b: IndexRun) => b.startedAt - a.startedAt);
}

export async function updateIndexRun(run: IndexRun): Promise<void> {
  const { store, complete } = await tx(STORES.indexRuns, 'readwrite');
  store.put(run);
  await complete;
}

export async function clearIndexRuns(): Promise<void> {
  const { store, complete } = await tx(STORES.indexRuns, 'readwrite');
  store.clear();
  await complete;
}

// Analytics Events

export async function addAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  const { store, complete } = await tx(STORES.analyticsEvents, 'readwrite');
  store.put(event);
  await complete;
}

export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  const { store, complete } = await tx(STORES.analyticsEvents, 'readonly');
  const result = await requestToPromise(store.getAll());
  await complete;
  return result.sort((a: AnalyticsEvent, b: AnalyticsEvent) => b.timestamp - a.timestamp);
}

export async function clearAnalyticsEvents(): Promise<void> {
  const { store, complete } = await tx(STORES.analyticsEvents, 'readwrite');
  store.clear();
  await complete;
}

// Activity

export async function addActivityEntry(entry: ActivityEntry): Promise<void> {
  const { store, complete } = await tx(STORES.activity, 'readwrite');
  store.put(entry);
  await complete;
}

export async function getActivityEntries(): Promise<ActivityEntry[]> {
  const { store, complete } = await tx(STORES.activity, 'readonly');
  const result = await requestToPromise(store.getAll());
  await complete;
  return result.sort((a: ActivityEntry, b: ActivityEntry) => b.timestamp - a.timestamp).slice(0, 50);
}

export async function clearActivity(): Promise<void> {
  const { store, complete } = await tx(STORES.activity, 'readwrite');
  store.clear();
  await complete;
}

// Settings

export async function getSettings(): Promise<AppSettings> {
  const { store, complete } = await tx(STORES.settings, 'readonly');
  const result = await requestToPromise(store.get(DEFAULT_SETTINGS.id));
  await complete;
  return result || { ...DEFAULT_SETTINGS };
}

export async function putSettings(settings: AppSettings): Promise<void> {
  const { store, complete } = await tx(STORES.settings, 'readwrite');
  store.put(settings);
  await complete;
}

// Wipe

export async function wipeAllData(): Promise<void> {
  const db = await openDB();
  const storeNames = [
    STORES.memories,
    STORES.searchHistory,
    STORES.indexRuns,
    STORES.analyticsEvents,
    STORES.settings,
    STORES.activity,
  ];
  const transaction = db.transaction(storeNames, 'readwrite');
  for (const name of storeNames) {
    transaction.objectStore(name).clear();
  }
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Health check

export async function checkStorageHealth(): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!('indexedDB' in globalThis)) {
      return { ok: false, error: 'IndexedDB is not supported in this browser.' };
    }
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      if (quota > 0 && used / quota > 0.9) {
        return { ok: false, error: 'Storage is almost full. Export your data and clear old memories.' };
      }
    }
    await openDB();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown storage error.' };
  }
}

/** Generate a unique ID */
export function generateId(): string {
  return crypto.randomUUID();
}
