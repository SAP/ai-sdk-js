import { join } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    snapshotSerializers: [join(import.meta.dirname, '/scripts/vitest-snapshot-serializers.ts')],
    globalSetup: [join(import.meta.dirname, 'global-test-setup.mjs')],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov'],
    },
    projects: [
      'packages/*/vitest.config.ts'
    ],
  },
});
