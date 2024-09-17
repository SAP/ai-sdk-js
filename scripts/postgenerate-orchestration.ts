/* eslint-disable no-console */
import { resolve } from 'node:path';
import { transformFilesInDirectory } from './util.js';

const correctedNames = [
  ['LLMModuleResult', 'LlmModuleResult'],
  ['LLMModuleConfig', 'LlmModuleConfig'],
  ['LLMChoice', 'LlmChoice']
];

// Entry point: Get the root directory from command-line arguments
const rootDir = process.argv[2];

if (!rootDir) {
  console.error('Please provide the root directory as an argument.');
  process.exit(1);
}

transformFilesInDirectory(resolve(rootDir), file =>
  correctedNames.reduce(
    (newFile, [wrongName, correctName]) =>
      newFile.replace(new Regexp(`${wrongName}`, 'g'), correctName),
    file
  )
)
  .then(() => console.log('All files processed successfully.'))
  .catch(err => console.error('Error processing files:', err));
