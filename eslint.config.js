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
      'packages/ai-api/src/client/**/*',
      'packages/foundation-models/src/azure-openai/client/inference/schema/on-your-data-system-assigned-managed-identity-authentication-options.ts'
    ]
  },
  {
    files: [
      '**/test-util/**/*.ts',
      '**/packages/orchestration/src/client/**/*'
    ],
    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    files: ['packages/langchain/**/*.ts'],
    rules: {
      'import/no-internal-modules': 'off'
    }
  },
  {
    files: ['packages/foundation-models/src/azure-openai/client/inference/schema/*.ts'],
    rules: {
      'jsdoc/check-indentation': 'off'
    }
  },
  {
    ignores: ['**/dist-cjs/**/*']
  }
];
