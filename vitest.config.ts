import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    snapshotSerializers: ['./scripts/vitest-snapshot-serializers.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov'],
    },
    globalSetup: [new URL('./global-test-setup.mjs', import.meta.url).pathname],
  },
});
