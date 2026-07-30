import { defineProject, mergeConfig } from 'vitest/config';
import { sharedConfig } from '../../vitest.shared.js';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      name: 'smoke-tests',
      include: ['test/**/*.test.ts'],
      exclude: ['**/dist/**', '**/node_modules/**'],
      globalSetup: ['./scripts/global-setup.ts']
    }
  })
);
