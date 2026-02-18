import '@testing-library/jest-dom/vitest';

// Mock IndexedDB for tests
class FakeIDBFactory {
  open() {
    return {
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
      result: null,
    };
  }
  deleteDatabase() {
    return { onsuccess: null, onerror: null };
  }
}

if (typeof globalThis.indexedDB === 'undefined') {
  Object.defineProperty(globalThis, 'indexedDB', {
    value: new FakeIDBFactory(),
    writable: true,
  });
}

// Mock crypto.randomUUID
if (!globalThis.crypto?.randomUUID) {
  let counter = 0;
  const mockCrypto = {
    ...globalThis.crypto,
    randomUUID: () => `test-uuid-${++counter}`,
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: globalThis.crypto?.subtle,
  };
  Object.defineProperty(globalThis, 'crypto', { value: mockCrypto, writable: true });
}
