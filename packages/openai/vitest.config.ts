import { definePackageConfig } from '../../vitest.shared.ts';

const config = definePackageConfig('openai');

config.test.server = {
  deps: {
    inline: ['openai', 'ws']
  }
};

export default config;
