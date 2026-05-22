/* eslint-disable no-console */
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';

const port = process.env.SMOKE_TEST_PORT ?? '8080';
const timeout = 30_000;
const envFile = resolve(import.meta.dirname, '..', '.env');

export default async function setup(): Promise<void> {
  if (process.env.VCAP_SERVICES || process.env.CI) {
    return;
  }

  const envVars = await readFile(envFile, 'utf-8')
    .then(parseEnv)
    .catch(() => ({}));

  const serverBin = resolve(
    import.meta.dirname,
    '..',
    'node_modules',
    '@sap-ai-sdk',
    'sample-code',
    'dist',
    'server.js'
  );

  console.log('Starting local smoke test server...');
  const server = spawn(process.execPath, [serverBin], {
    env: { ...process.env, ...envVars, PORT: port },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (!server.stdout || !server.stderr) {
    throw new Error('Failed to spawn server');
  }

  (globalThis as any).__SMOKE_TEST_SERVER__ = server;

  const {
    promise: serverPromise,
    resolve: resolvePromise,
    reject
  } = Promise.withResolvers<void>();

  const timer = setTimeout(
    () => reject(new Error(`Server did not start within ${timeout}ms`)),
    timeout
  );

  server.stdout.on('data', (data: Buffer) => {
    if (data.toString().includes('Server running')) {
      clearTimeout(timer);
      resolvePromise();
    }
  });

  server.stderr.on('data', (data: Buffer) => console.error(data.toString()));
  server.on('error', reject);

  // Wait for the server to start before proceeding with the tests
  await serverPromise;

  process.env.SMOKE_TEST_URL = `http://localhost:${port}`;
  console.log(`Smoke test server running at ${process.env.SMOKE_TEST_URL}`);
}
