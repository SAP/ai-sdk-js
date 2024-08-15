/* eslint-disable no-console */
import * as fs from 'fs/promises';
import * as path from 'path';

// Function to read a file and return its contents
async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

// Function to write data to a file
async function writeFile(filePath: string, data: string): Promise<void> {
  await fs.writeFile(filePath, data, 'utf-8');
}

async function processApiFile(filePath: string) {
    const content = await readFile(filePath);
    const updatedContent = content.replace(/import \{ OpenApiRequestBuilder \} from '@sap-cloud-sdk\/openapi';/g, "import { OpenApiRequestBuilder } from '@sap-ai-sdk\/core';");
  await writeFile(filePath, updatedContent);
}


// Function to recursively traverse the directory and apply transformations
async function traverseDirectory(dirPath: string): Promise<void> {
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);

    try {
        const stat = await fs.stat(filePath);
  
        if (stat.isDirectory() && path.basename(filePath) !== 'schema') {
          await traverseDirectory(filePath); // Recursive traversal for directories
        } else if (stat.isFile() && file !== 'index.ts') {
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

console.log(rootDir);

traverseDirectory(path.resolve(rootDir))
  .then(() => console.log('All files processed successfully.'))
  .catch(err => console.error('Error processing files:', err));
