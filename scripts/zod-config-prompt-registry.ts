import { join, dirname } from 'node:path';
import { createLogger } from '@sap-cloud-sdk/util';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { generateAndWriteConfig } from './generate-zod-config.js';

const logger = createLogger('generate-zod-config');

// Recursively finds all imported files
async function findImportedFiles(filePath: string, collectedFiles = new Set<string>()): Promise<void> {
  if (!existsSync(filePath) || collectedFiles.has(filePath)) {
    logger.warn(`File ${filePath} does not exist or has already been processed.`);
    return;
  }

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
    logger.error('Usage: node --loader ts-node/esm ../../scripts/zod-config-prompt-registry.ts <inputFile> <outputSchemaFolder>');
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
