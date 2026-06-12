import { defineProject, mergeConfig } from 'vitest/config';
import { sharedConfig } from '../../vitest.shared.js';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      name: 'e2e-tests',
      include: ['src/**/*.test.ts'],
      exclude: ['**/dist/**'],
      testTimeout: 45000
    }
  })
);
