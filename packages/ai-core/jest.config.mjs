import config from '../../jest.config.mjs';
const aiCoreConfig = {
  ...config,
  displayName: 'ai-core',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        useESM: true
      }
    ]
  },
};

export default aiCoreConfig;
