import flatConfig from '@sap-cloud-sdk/eslint-config/flat-config.js';

export default [
  ...flatConfig,
  {
    // Eslint flat config is not supported by eslint-plugin-import.
    // https://github.com/import-js/eslint-plugin-import/issues/2556
    rules: {
      'import/namespace': 'off',
      'import/no-internal-modules': 'off'
      // TODO: add this once there is a new release of eslint-plugin-import
      // 'import/no-internal-modules': [
      //   'error',
      //   { allow: ['@sap-cloud-sdk/*/internal.js'] }
      // ]
    }
  },
  {
    ignores: [
      '**/*.d.ts',
      '**/dist/**/*',
      '**/coverage/**/*',
      'packages/ai-api/src/client/**/*'
    ]
  },
  {
    files: [
      '**/test-util/**/*.ts',
      '**/packages/gen-ai-hub/src/orchestration/client/**/*'
    ],
    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    files: [
      '**/packages/gen-ai-hub/src/orchestration/client/api/default-api.ts'
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },
  {
    ignores: ['**/dist-cjs/**/*']
  }
];
