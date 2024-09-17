const smokeTestRoute =
  'https://smoke-test-app.cfapps.eu12-001.hana.ondemand.com';
describe('Smoke Test', () => {
  it('aicore client retrieves a list of deployments', async () => {
    await expect(
      fetch(`${smokeTestRoute}/ai-api/get-deployments`)
    ).resolves.toHaveProperty('status', 200);
  });

  it('orchestration client retrieves completion results', async () => {
    await expect(
      fetch(`${smokeTestRoute}/orchestration`)
    ).resolves.toHaveProperty('status', 200);
  });
});
