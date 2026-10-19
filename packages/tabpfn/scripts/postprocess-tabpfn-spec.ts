import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

interface DisposableDirectory {
  path: string;
  [Symbol.asyncDispose](): Promise<void>;
}

// Generation runs with Node 26; the repository's Node 22 type package does not
// declare this newer disposable-temp-directory API yet.
const fsWithDisposable = fs as typeof fs & {
  mkdtempDisposable(prefix: string): Promise<DisposableDirectory>;
};
const mkdtempDisposable = (prefix: string) =>
  fsWithDisposable.mkdtempDisposable(prefix);
const { readFile, rename, writeFile } = fs;

const filePath = process.argv[2];

if (!filePath) {
  throw new Error(
    'Please provide the bundled OpenAPI file path as an argument.'
  );
}

await using tmpDir = await mkdtempDisposable(resolve(tmpdir(), 'tabpfn-spec-'));
const temporaryFilePath = join(tmpDir.path, basename(filePath));
await rename(filePath, temporaryFilePath);

const spec = JSON.parse(await readFile(temporaryFilePath, 'utf8')) as {
  paths: Record<string, unknown>;
  servers?: unknown;
  components?: { schemas?: Record<string, unknown> };
};

const predictPath = spec.paths['/predict'];
if (!predictPath || Object.keys(spec.paths).length !== 1) {
  throw new Error(
    `Expected the bundled TabPFN spec to contain only /predict; found ${Object.keys(spec.paths).join(', ')}`
  );
}

spec.servers = [{ url: '/', description: 'The TabPFN deployment URL.' }];

const requestBody = (
  predictPath as {
    post: { requestBody: { content: Record<string, unknown> } };
  }
).post.requestBody;

for (const [name, mediaType] of [
  ['json', 'application/json'],
  ['multipart', 'multipart/form-data']
] as const) {
  const content = requestBody.content[mediaType];
  if (!content) {
    throw new Error(`The /predict operation has no ${mediaType} request body.`);
  }

  const splitSpec = structuredClone(spec);
  const splitRequest = (
    splitSpec.paths['/predict'] as {
      post: { requestBody: { content: Record<string, unknown> } };
    }
  ).post.requestBody;
  splitRequest.content = { [mediaType]: content };
  const schemas = splitSpec.components?.schemas;
  if (schemas) {
    const referencedSchemas = new Set<string>();
    const collectSchemaReferences = (value: unknown): void => {
      if (!value || typeof value !== 'object') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(collectSchemaReferences);
        return;
      }

      Object.entries(value).forEach(([key, child]) => {
        if (key === '$ref' && typeof child === 'string') {
          const match = /^#\/components\/schemas\/(.+)$/.exec(child);
          if (match?.[1] && !referencedSchemas.has(match[1])) {
            referencedSchemas.add(match[1]);
            collectSchemaReferences(schemas[match[1]]);
          }
        } else {
          collectSchemaReferences(child);
        }
      });
    };

    collectSchemaReferences(splitSpec.paths);
    splitSpec.components!.schemas = Object.fromEntries(
      Object.entries(schemas).filter(([schemaName]) =>
        referencedSchemas.has(schemaName)
      )
    );
  }

  await writeFile(
    filePath.replace(
      /-predict\.json$/,
      name === 'json' ? '.json' : '-multipart.json'
    ),
    `${JSON.stringify(splitSpec, null, 2)}\n`
  );
}
