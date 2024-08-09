import flatConfig from '@sap-cloud-sdk/eslint-config/flat-config.js';

export default [
  ...flatConfig,
  {
    ignores: ['**/dist/**/*', '**/coverage/**/*', 'packages/ai-core/src/client/**/*'],
  },
  {
    files: ['**/test-util/**/*.ts', '**/packages/gen-ai-hub/src/orchestration/client/**/*'],
    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    files: ['**/packages/gen-ai-hub/src/orchestration/client/api/default-api.ts'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  }
];
