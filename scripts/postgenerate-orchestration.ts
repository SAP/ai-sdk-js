/* eslint-disable no-console */
import { resolve } from 'node:path';
import { camelCase, pascalCase } from '@sap-cloud-sdk/util';
import { transformFilesInDirectory } from './util.js';

const namesToCorrect = [
  'LLMModuleResult',
  'LLMModuleConfig',
  'LLMChoice',
  'DPIEntities',
  'DPIEntityConfig',
  'DPIConfig'
];

// Entry point: Get the root directory from command-line arguments
const rootDir = process.argv[2];

if (!rootDir) {
  console.error('Please provide the root directory as an argument.');
  process.exit(1);
}

transformFilesInDirectory(resolve(rootDir), file =>
  namesToCorrect.reduce(
    (newFile, wrongName) =>
      newFile.replace(
        new RegExp(`\\b${wrongName}\\b`, 'g'),
        pascalCase(camelCase(wrongName))
      ),
    file
  )
)
  .then(() => console.log('All files processed successfully.'))
  .catch(err => console.error('Error processing files:', err));
