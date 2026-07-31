import { defineProject, mergeConfig } from 'vitest/config';
import { join } from 'node:path';

const errorWithCauseSerializer = join(
  import.meta.dirname,
  'scripts/vitest-snapshot-serializers.ts'
);

const baseConfig = defineProject({
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
    defineProject({
      test: {
        name,
        include: ['src/**/*.test.ts'],
        exclude: ['**/dist/**'],
        globalSetup: ['../../global-test-setup.mjs'],
      },
    })
  );
}
