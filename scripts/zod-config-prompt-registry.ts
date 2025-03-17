import { writeFile } from 'node:fs/promises';
import { basename, relative, join, dirname } from 'node:path';
import { glob } from 'glob';
import { createLogger } from '@sap-cloud-sdk/util';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { generateAndWriteConfig } from './generate-zod-config.js';

const logger = createLogger('generate-zod-config');

// Define the type for the ts-to-zod configuration
interface TsToZodConfig {
  name: string;
  input: string;
  output: string;
};

// Recursively finds all imported files
async function findImportedFiles(filePath: string, collectedFiles = new Set<string>()): Promise<void> {
    console.log(filePath);
  if (!existsSync(filePath) || collectedFiles.has(filePath)) return;

  collectedFiles.add(filePath);

  const content = await readFile(filePath, 'utf8');
  const importRegex = /import\s+type\s+.*?['\"](.*?\.js)['\"];?/g;

  for (const match of content.matchAll(importRegex)) {
    const importedPath = match[1].replace(/\.js$/, '.ts');;
    const absolutePath = join(dirname(filePath), importedPath);

    await findImportedFiles(absolutePath, collectedFiles); // Recursively find imports
  }
}

async function main(args: string[]) {
  if (args.length !== 2) {
    logger.error('Usage: node --loader ts-node/esm generate-zod-config.ts <inputFile> <outputSchema>');
    process.exit(1);
  }

  const [inputFile, outputSchema] = args;
  try {
    const collectedFiles = new Set<string>();
    await findImportedFiles(inputFile, collectedFiles);
    await generateAndWriteConfig(Array.from(collectedFiles), outputSchema);
  } catch (error) {
    logger.error('Error while generating configuration file:', error);
  }
}

// Run the main function
main(process.argv.slice(2));
