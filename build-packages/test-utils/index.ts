import { vi } from 'vitest';

/**
 * Mock all `fs` module variants with pure memfs using vitest.
 * @internal
 */
export function mockFsWithMemfs(): void {
  vi.mock('fs', () =>
    import('memfs').then(m => ({
      ...m.fs,
      default: m.fs,
      __esModule: true
    }))
  );
  vi.mock('fs/promises', () =>
    import('memfs').then(m => ({
      ...m.fs.promises,
      default: m.fs.promises,
      __esModule: true
    }))
  );
  vi.mock('node:fs', () =>
    import('memfs').then(m => ({
      ...m.fs,
      default: m.fs,
      __esModule: true
    }))
  );
  vi.mock('node:fs/promises', () =>
    import('memfs').then(m => ({
      ...m.fs.promises,
      default: m.fs.promises,
      __esModule: true
    }))
  );
}
