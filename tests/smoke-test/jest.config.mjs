import config from '../../jest.config.mjs';
export default {
  ...config,
  globalSetup: undefined,
  globalTeardown: undefined,
  displayName: 'smoke-test',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
