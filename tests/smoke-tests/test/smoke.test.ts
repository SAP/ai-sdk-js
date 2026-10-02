const smokeTestRoute =
  process.env.SMOKE_TEST_URL ??
  'https://smoke-test-app.cfapps.eu12-001.hana.ondemand.com';
const itCfOnly = smokeTestRoute.includes('localhost') ? it.skip : it;

describe('Smoke Test', () => {
  // oxlint-disable-next-line vitest/expect-expect
  it('aicore client retrieves a list of deployments', async () => {
    await expect(
      fetch(`${smokeTestRoute}/ai-api/deployments`)
    ).resolves.toHaveProperty('status', 200);
  });

  itCfOnly(
    'aicore client retrieves a list of deployments with custom destination',
    async () => {
      // oxlint-disable-next-line vitest/no-standalone-expect
      await expect(
        fetch(`${smokeTestRoute}/ai-api/deployments-with-destination`)
      ).resolves.toHaveProperty('status', 200);
    }
  );

  // oxlint-disable-next-line vitest/expect-expect
  it('orchestration client retrieves completion results', async () => {
    await expect(
      fetch(`${smokeTestRoute}/orchestration/simple`)
    ).resolves.toHaveProperty('status', 200);
  });

  // oxlint-disable-next-line vitest/expect-expect
  it('langchain client retrieves completion results', async () => {
    await expect(
      fetch(`${smokeTestRoute}/langchain/invoke`)
    ).resolves.toHaveProperty('status', 200);
  });

  itCfOnly(
    'azure-openai client retrieves completion results with custom destination',
    async () => {
      // oxlint-disable-next-line vitest/no-standalone-expect
      await expect(
        fetch(`${smokeTestRoute}/azure-openai/chat-completion-with-destination`)
      ).resolves.toHaveProperty('status', 200);
    }
  );

  // oxlint-disable-next-line vitest/expect-expect
  it('openai client retrieves completion results', async () => {
    await expect(
      fetch(`${smokeTestRoute}/openai/chat-completion`)
    ).resolves.toHaveProperty('status', 200);
  });
});
