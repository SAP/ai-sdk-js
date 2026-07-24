import flatConfig from '@sap-cloud-sdk/eslint-config/flat-config.js';
export default [
  ...flatConfig,
  {
    files: ['**/*.ts'],
    rules: {
      'import-x/namespace': 'off',
      'import-x/no-internal-modules': [
        'error',
        {
          allow: [
            '@sap-cloud-sdk/*/internal.js',
            '@sap-ai-sdk/*/internal.js',
            '@langchain/core/**',
            '@langchain/langgraph/**',
            'langchain/**',
            'zod/**',
            '*/index.js',
            '*/client/**/index.js',
            './client/**/index.js',
            'client/**/index.js',
            'openai/**'
          ]
        }
      ],
      'import-x/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: false
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'varsIgnorePattern': '^_',
          'argsIgnorePattern': '^_'
        }
      ]
    }
  },
  {
    ignores: [
      '**/*.d.ts',
      '**/dist/**/*',
      '**/dist-cjs/**/*',
      '**/coverage/**/*',
      'packages/**/client/**/*',
      'packages/prompt-registry/src/zod/**/*'
    ]
  },
  {
    files: [
      '**/test/**/*',
      '**/test-util/**/*',
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/dist-cjs/**/*',
      '**/scripts/*'
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import-x/no-internal-modules': 'off',
      'no-unused-expressions': 'off',
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    // support-bot runs as a standalone automation script (GitHub Actions bot), not as a library — JSDoc and console restrictions don't apply
    files: ['sample-code/src/support-bot/**/*'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'no-console': 'off'
    }
  }
];
