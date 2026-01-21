/* eslint-disable no-console */
import { resolve } from 'node:path';
import { transformFile } from './util.js';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the API file path as an argument.');
  process.exit(1);
}

transformFile(resolve(filePath), file =>
  file.replace(
    "* This API is part of the 'rpt' service.",
    "* This API is part of the 'rpt' service.\n * @internal"
  )
)
  .then(() => console.log('File processed successfully.'))
  .catch(err => console.error('Error processing file:', err));
