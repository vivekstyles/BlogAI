import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';

// Never let tests reach real network endpoints (e.g. the submission POST).
// Tests that need fetch stub it with vi.stubGlobal('fetch', ...).
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Unexpected network call in test')));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// Polyfill window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Polyfill navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: async () => {},
    readText: async () => '',
  },
});
