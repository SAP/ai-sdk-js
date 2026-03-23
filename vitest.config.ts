import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts', 'tests/*/vitest.config.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['html'],
      reportsDirectory: 'coverage'
    }
  }
});
