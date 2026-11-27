/* oxlint-disable no-console */
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';

import type { ChildProcess } from 'node:child_process';

const port = process.env.SMOKE_TEST_PORT ?? '0';
const timeout = 30_000;
const envFile = resolve(import.meta.dirname, '..', '.env');
let smokeTestServer: ChildProcess | undefined;

export async function setup(): Promise<void> {
  if (process.env.SMOKE_TEST_URL) {
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

  smokeTestServer = server;

  const {
    promise: serverPromise,
    resolve: resolvePromise,
    reject
  } = Promise.withResolvers<string>();

  const timer = setTimeout(
    () => reject(new Error(`Server did not start within ${timeout}ms`)),
    timeout
  );

  let output = '';
  server.stdout.on('data', (data: Buffer) => {
    output += data.toString();
    const match = /Server running at (http:\/\/localhost:\d+)\r?\n/.exec(
      output
    );
    if (match) {
      clearTimeout(timer);
      resolvePromise(match[1]);
    }
  });

  server.stderr.on('data', (data: Buffer) => console.error(data.toString()));
  server.on('error', reject);

  process.env.SMOKE_TEST_URL = await serverPromise;
  console.log(`Smoke test server running at ${process.env.SMOKE_TEST_URL}`);
}

export async function teardown(): Promise<void> {
  const server = smokeTestServer;
  if (server) {
    server.kill();
    smokeTestServer = undefined;
  }
}
