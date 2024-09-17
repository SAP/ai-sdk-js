/* eslint-disable no-console */
import { readdir, stat } from 'node:fs/promises';
import { join, basename, resolve } from 'node:path';
import { transformFile } from './util.js';

async function processApiFile(filePath: string) {
  return transformFile(filePath, file =>
    file.replace(
      /import \{ OpenApiRequestBuilder \} from '@sap-cloud-sdk\/openapi';/g,
      "import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';"
    )
  );
}

// Function to recursively traverse the directory and apply transformations
async function traverseDirectory(dirPath: string): Promise<void> {
  const files = await readdir(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);

    try {
      const { isDirectory, isFile } = await stat(filePath);

      if (isDirectory() && basename(filePath) !== 'schema') {
        await traverseDirectory(filePath); // Recursive traversal for directories
      } else if (isFile() && file !== 'index.ts') {
        await processApiFile(filePath); // Process files named 'index.ts'
      }
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err);
    }
  }
}

// Entry point: Get the root directory from command-line arguments
const rootDir = process.argv[2];

if (!rootDir) {
  console.error('Please provide the root directory as an argument.');
  process.exit(1);
}

traverseDirectory(resolve(rootDir))
  .then(() => console.log('All files processed successfully.'))
  .catch(err => console.error('Error processing files:', err));
