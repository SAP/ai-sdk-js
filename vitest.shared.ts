import { defineConfig, mergeConfig } from 'vitest/config';

const baseConfig = defineConfig({
  test: {
    clearMocks: true
  }
});

/** @internal */
export const sharedConfig = baseConfig;

/** @internal */
export function definePackageConfig(name: string) {
  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        name,
        include: ['src/**/*.test.ts'],
        exclude: ['**/dist/**'],
        globalSetup: ['../../global-test-setup.mjs']
      }
    })
  );
}
