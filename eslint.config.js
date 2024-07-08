import flatConfig from '@sap-cloud-sdk/eslint-config/flat-config.js';

export default [
  ...flatConfig,
  {
    ignores: ['**/dist/**/*', '**/coverage/**/*', 'packages/ai-core/src/'],
  },
  {
    files: ['**/test-util/**/*.ts'],
    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  }
];
