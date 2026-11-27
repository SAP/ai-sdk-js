import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { checkApiOfPackage } from './index.ts';

let packageDirectory: string;

beforeEach(async () => {
  packageDirectory = await mkdtemp(join(tmpdir(), 'public-api-test-'));
  vi.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('Public API check failed.');
  });
  vi.stubEnv('INPUT_FORCE_INTERNAL_EXPORTS', 'false');
  vi.stubEnv('INPUT_IGNORED_PATH_PATTERN', '');
});

afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  await rm(packageDirectory, { recursive: true, force: true });
});

it('checks a subpath using its source directory without excluding sibling root exports', async () => {
  await mkdir(join(packageDirectory, 'src/openai/native'), {
    recursive: true
  });
  await Promise.all(
    Object.entries({
      'package.json': JSON.stringify({
        name: 'public-api-test',
        type: 'module',
        exports: {
          '.': { types: './dist/index.d.ts' },
          './openai': { types: './dist/openai/native/index.d.ts' }
        }
      }),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'ES2024',
          module: 'NodeNext',
          declaration: true,
          types: [],
          skipLibCheck: true
        }
      }),
      'src/index.ts': "export { LegacyClient } from './openai/client.js';",
      'src/openai/client.ts': 'export class LegacyClient {}',
      'src/openai/native/index.ts':
        "export { createClient } from './client.js';",
      'src/openai/native/client.ts':
        'export async function createClient(): Promise<string> { return "client"; }'
    }).map(([file, content]) =>
      writeFile(join(packageDirectory, file), content)
    )
  );

  await expect(checkApiOfPackage(packageDirectory)).resolves.toBeUndefined();
});
