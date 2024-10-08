import flatConfig from '@sap-cloud-sdk/eslint-config/flat-config.js';
export default [
  ...flatConfig,
  {
    files: ['**/*.ts'],
    rules: {
      'import/namespace': 'off',
      'import/no-internal-modules': [
        'error',
        {
          allow: [
            '@sap-cloud-sdk/*/internal.js',
            '@sap-ai-sdk/*/internal.js',
            '@langchain/core/**',
            'langchain/**',
            '*/index.js',
            '*/client/**/index.js'
          ]
        }
      ],
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: false
        }
      ]
    }
  },
  {
    ignores: [
      '**/*.d.ts',
      '**/dist/**/*',
      '**/coverage/**/*',
      'packages/**/client/**/*'
    ]
  },
  {
    files: [
      '**/test/**/*',
      '**/test-util/**/*',
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/dist-cjs/**/*'
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/no-internal-modules': 'off',
      'no-unused-expressions': 'off',
      'jsdoc/require-jsdoc': 'off'
    }
  }
];
