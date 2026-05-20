/* eslint-disable no-console */
import { resolve } from 'node:path';
import { transformFile } from './util.js';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the API file path as an argument.');
  process.exit(1);
}

try {
  await transformFile(resolve(filePath), file =>
    file.replace(
      "* This API is part of the 'batch-service' service.",
      "* This API is part of the 'batch-service' service.\n * @experimental This API is experimental and may change at any time without prior notice."
    )
  );
  console.log('File processed successfully.');
} catch (err) {
  console.error('Error processing file:', err);
}
