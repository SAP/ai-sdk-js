import { defineConfig, mergeConfig } from 'vitest/config';
import { join } from 'node:path';

const errorWithCauseSerializer = join(
  import.meta.dirname,
  'scripts/vitest-snapshot-serializers.ts'
);

const baseConfig = defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    snapshotSerializers: [errorWithCauseSerializer],
  },
});

/** @internal */
export const sharedConfig = baseConfig;

/** @internal */
export function definePackageConfig(name: string) {
  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        name,
        include: ['src/**/*.test.ts'],
        exclude: ['**/dist/**'],
        globalSetup: ['../../global-test-setup.mjs'],
        coverage: {
          provider: 'v8',
          reporter: ['lcov', 'html'],
          reportsDirectory: 'coverage',
        },
      },
    })
  );
}
