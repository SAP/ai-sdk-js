import config from '../../jest.config.mjs';
const genAiConfig = {
  ...config,
  displayName: 'gen-ai-hub',
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

export default genAiConfig;
