import config from '../../jest.config.mjs';

export default {
  ...config,
  globalSetup: './scripts/server-setup.ts',
  globalTeardown: './scripts/server-teardown.ts',
  displayName: 'smoke-tests',
};
