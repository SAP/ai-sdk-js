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

// Function to process index.ts files and update export statements
async function processIndexFile(filePath: string): Promise<void> {
  const content = await readFile(filePath);
  const updatedContent = content.replace(/export \* from '\.\/([^']*)';/g, "export * from './$1.js';");
  await writeFile(filePath, updatedContent);
}

// Function to process root-level files and update import statements for the schema folder
async function processRootFile(filePath: string): Promise<void> {
  const content = await readFile(filePath);
  const updatedContent = content.replace(/import type \{ ([^}]*) \} from '\.\/schema';/g, "import type { $1 } from './schema/index.js';");
  await writeFile(filePath, updatedContent);
}

// Function to process schema-level files and update import statements
async function processSchemaFile(filePath: string): Promise<void> {
  const content = await readFile(filePath);
  const updatedContent = content.replace(/import type \{ ([^}]*) \} from '\.\/([^']*)';/g, "import type { $1 } from './$2.js';");
  await writeFile(filePath, updatedContent);
}

// Function to recursively traverse the directory and apply transformations
async function traverseDirectory(dirPath: string): Promise<void> {
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await traverseDirectory(filePath);
    } else if (stat.isFile()) {
      if (file === 'index.ts') {
        await processIndexFile(filePath);
      } else if (dirPath === path.resolve(rootDir)) {
        await processRootFile(filePath);
      } else if (path.basename(dirPath) === 'schema') {
        await processSchemaFile(filePath);
      }
    }
  }
}

// Entry point: Get the root directory from command-line arguments
const rootDir = process.argv[2];

if (!rootDir) {
  console.error('Please provide the root directory as an argument.');
  process.exit(1);
}

traverseDirectory(path.resolve(rootDir))
  .then(() => console.log('All files processed successfully.'))
  .catch(err => console.error('Error processing files:', err));
