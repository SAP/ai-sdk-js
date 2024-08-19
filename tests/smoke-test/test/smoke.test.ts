const smokeTestRoute =
  'https://smoke-test-app.cfapps.eu12-001.hana.ondemand.com';
describe('Smoke Test', () => {
  it('aicore', async () => {
    await expect(fetch(`${smokeTestRoute}/llm`)).resolves.toHaveProperty(
      'status',
      200
    );
  });

  it('orchestration', async () => {
    await expect(
      fetch(`${smokeTestRoute}/orchestration`)
    ).resolves.toHaveProperty('status', 200);
  });
});
