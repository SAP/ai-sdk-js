import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov'],
      reportsDirectory: 'coverage'
    },
    projects: [
      'packages/*/vitest.config.ts',
      {
        test: {
          name: 'scripts',
          include: ['scripts/**/*.test.ts']
        }
      }
    ]
  }
});
