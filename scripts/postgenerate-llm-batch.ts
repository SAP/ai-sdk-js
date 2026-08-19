/* eslint-disable no-console */
import { resolve, basename } from 'node:path';
import { transformFile } from './util.ts';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the API file path as an argument.');
  process.exit(1);
}

const resolvedPath = resolve(filePath);
const fileName = basename(resolvedPath);

if (fileName === 'batches-api.ts') {
  transformFile(resolvedPath, file =>
    file.replace(
      "* This API is part of the 'batch-service' service.",
      "* This API is part of the 'llm-batch' service.\n * @experimental This API is experimental and may change at any time without prior notice."
    )
  )
    .then(() => console.log('File processed successfully.'))
    .catch(err => console.error('Error processing file:', err));
} else if (fileName === 'batch-create-request.ts') {
  // Assert each replacement actually matched. If the generator changes its
  // output format (JSDoc wording, indentation), a silent no-op would revert
  // the file to `model: string` without the LlmBatchModel import — fail loudly
  // instead so the anchor can be updated.
  const replaceOrFail = (file: string, from: string, to: string): string => {
    const next = file.replace(from, to);
    if (next === file) {
      console.error(
        `Anchor not found in ${fileName}: ${JSON.stringify(from)}. Update scripts/postgenerate-llm-batch.ts.`
      );
      process.exit(1);
    }
    return next;
  };

  transformFile(resolvedPath, file => {
    let next = replaceOrFail(
      file,
      "\n/**\n * Representation of the 'BatchCreateRequest' schema.\n */",
      "\nimport type { LlmBatchModel } from '@sap-ai-sdk/core';\n\n/**\n * Representation of the 'BatchCreateRequest' schema.\n */"
    );
    next = replaceOrFail(next, '    model: string;', '    model: LlmBatchModel;');
    return next;
  })
    .then(() => console.log('File processed successfully.'))
    .catch(err => console.error('Error processing file:', err));
} else {
  console.error(`Unknown file: ${fileName}`);
  process.exit(1);
}
