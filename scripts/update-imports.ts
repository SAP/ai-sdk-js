/* eslint-disable no-console */
import { basename, resolve } from 'node:path';
import { transformFilesInDirectory } from './util.js';

// Entry point: Get the root directory from command-line arguments
const rootDir = process.argv[2];

if (!rootDir) {
  console.error('Please provide the root directory as an argument.');
  process.exit(1);
}

transformFilesInDirectory(
  resolve(rootDir),
  file =>
    file.replace(
      /import \{ OpenApiRequestBuilder \} from '@sap-cloud-sdk\/openapi';/g,
      "import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';"
    ),
  {
    includeDir: dirPath => basename(dirPath) !== 'schema',
    includeFile: filePath => basename(filePath) !== 'index.ts'
  }
)
  .then(() => console.log('All files processed successfully.'))
  .catch(err => console.error('Error processing files:', err));
