import config from './jest.config.mjs';
const unitTestConfig = {
    ...config,
      // A path to a module which exports an async function that is triggered once before all test suites
   globalSetup: '../../global-test-setup.ts',

   // A path to a module which exports an async function that is triggered once after all test suites
   globalTeardown: '../../global-test-teardown.ts',
};

export default unitTestConfig;