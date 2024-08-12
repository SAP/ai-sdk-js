import config from '../../jest.config.mjs';
const coreConfig = {
  ...config,
  displayName: 'core',
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

export default coreConfig;
