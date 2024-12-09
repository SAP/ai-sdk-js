const smokeTestRoute =
  'https://smoke-test-app.cfapps.eu12-001.hana.ondemand.com';
describe('Smoke Test', () => {
  it('aicore client retrieves a list of deployments', async () => {
    await expect(
      fetch(`${smokeTestRoute}/ai-api/deployments`)
    ).resolves.toHaveProperty('status', 200);
  });

  it('aicore client retrieves a list of deployments with custom destination', async () => {
    await expect(
      fetch(`${smokeTestRoute}/ai-api/deployments-with-destination`)
    ).resolves.toHaveProperty('status', 200);
  });

  it('orchestration client retrieves completion results', async () => {
    await expect(
      fetch(`${smokeTestRoute}/orchestration/simple`)
    ).resolves.toHaveProperty('status', 200);
  });

  it('langchain client retrieves completion results', async () => {
    await expect(
      fetch(`${smokeTestRoute}/langchain/invoke`)
    ).resolves.toHaveProperty('status', 200);
  });

  it('azure-openai client retrieves completion results with custom destination', async () => {
    await expect(
      fetch(`${smokeTestRoute}/azure-openai/chat-completion-with-destination`)
    ).resolves.toHaveProperty('status', 200);
  });
});
