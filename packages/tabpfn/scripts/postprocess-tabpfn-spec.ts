import { readFile, writeFile } from 'node:fs/promises';

const filePath = process.argv[2];

if (!filePath) {
  throw new Error(
    'Please provide the bundled OpenAPI file path as an argument.'
  );
}

const spec = JSON.parse(await readFile(filePath, 'utf8')) as {
  servers?: { url: string; description?: string }[];
};

// The bundled spec carries the container's default server; point the
// generated client at the TabPFN deployment URL instead.
spec.servers = [{ url: '/', description: 'The TabPFN deployment URL.' }];

await writeFile(filePath, `${JSON.stringify(spec, null, 2)}\n`);
