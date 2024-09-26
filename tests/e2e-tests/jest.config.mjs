import config from '../../jest.config.mjs';

export default {
  ...config,
  globalSetup: undefined,
  globalTeardown: undefined,
  displayName: 'e2e-tests',
  testTimeout: 10000,
};
