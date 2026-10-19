/* oxlint-disable no-console */
import { rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import { transformFile } from './util.ts';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the API file path as an argument.');
  process.exit(1);
}

await transformFile(resolve(filePath), file =>
  file.replace(
    /(\* This API is part of the 'tabpfn(?:-multipart)?' service\.)(?!\n \* @internal)/,
    '$1\n * @internal'
  )
)
  .then(() => console.log('File processed successfully.'))
  .catch(err => console.error('Error processing file:', err));

if (filePath.includes('tabpfn-multipart')) {
  const schemaDirectory = join(dirname(resolve(filePath)), 'schema');
  await rm(join(schemaDirectory, 'error-response.ts'));
  await transformFile(join(schemaDirectory, 'index.ts'), file =>
    file.replace("export * from './error-response.js';\n", '')
  );
}
