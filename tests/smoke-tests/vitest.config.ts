import { defineProject, mergeConfig } from 'vitest/config';
import { sharedConfig } from '../../vitest.shared.js';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      name: 'smoke-tests',
      include: ['**/*.test.ts'],
      exclude: ['**/dist/**']
    }
  })
);
