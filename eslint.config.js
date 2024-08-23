import flatConfig from '@sap-cloud-sdk/eslint-config/flat-config.js';

export default [
  ...flatConfig,
  {
    // Estlint flat config is not supported by eslint-plugin-import.
    // https://github.com/import-js/eslint-plugin-import/issues/2556
    rules: { 'import/namespace': 'off'}
  },
  {
    ignores: ['**/*.d.ts', '**/dist/**/*', '**/coverage/**/*', 'packages/ai-core/src/client/**/*'],
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
