// eslint-disable-next-line import-x/no-internal-modules
import { replacePlugin } from 'rolldown/plugins';
import { vi } from 'vitest';
import type { RolldownOptions } from 'rolldown';

/**
 * Mock all `fs` module variants with pure memfs using `jest.unstable_mockModule` (ESM).
 * Must be called before any dynamic `import()` of modules that use `fs`.
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

/**
 * Returns the standard rolldown config for bundling a GitHub Action.
 * @param actionName - The action directory name under `.github/actions/`.
 * @internal
 */
export function defineActionConfig(actionName: string): RolldownOptions {
  const actionDir = `../../.github/actions/${actionName}`;

  return {
    input: 'index.ts',
    platform: 'node',
    plugins: [
      replacePlugin(
        {
          __dirname: 'import.meta.dirname',
          __filename: 'import.meta.filename'
        },
        {
          preventAssignment: true
        }
      )
    ],
    resolve: {
      conditionNames: ['import', 'default', 'workspace']
    },
    output: {
      dir: `${actionDir}/dist`,
      cleanDir: true,
      minifyInternalExports: false,
      format: 'esm'
    }
  };
}
