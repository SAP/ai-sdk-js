export default async function teardown(): Promise<void> {
  const server = (globalThis as any).__SMOKE_TEST_SERVER__;
  if (server) {
    server.kill();
  }
}
