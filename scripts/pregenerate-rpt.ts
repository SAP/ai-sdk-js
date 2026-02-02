/* eslint-disable no-console */
import { resolve } from 'node:path';
import { transformFile } from './util.js';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the spec file (JSON) path as an argument.');
  process.exit(1);
}

transformFile(resolve(filePath), file =>
  JSON.stringify(
    { ...JSON.parse(file), 'x-sap-cloud-sdk-api-name': 'RptApi' },
    null,
    2
  )
)
  .then(() => console.log('File processed successfully.'))
  .catch(err => console.error('Error processing file:', err));
