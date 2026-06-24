import config from '../../jest.config.mjs';

export default {
  ...config,
  globalSetup: import.meta.resolve('./scripts/server-setup.ts'),
  globalTeardown: import.meta.resolve('./scripts/server-teardown.ts'),
  displayName: 'smoke-tests'
};
