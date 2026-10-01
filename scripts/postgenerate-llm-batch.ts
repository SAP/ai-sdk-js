/* oxlint-disable no-console */
import { resolve, join } from 'node:path';

import { transformFile } from './util.ts';

const clientDir = process.argv[2];

if (!clientDir) {
  console.error(
    'Please provide the batch-service client directory path as an argument.'
  );
  process.exit(1);
}

const dir = resolve(clientDir);

const replaceOrFail = (
  content: string,
  from: string,
  to: string,
  fileName: string
): string => {
  const next = content.replace(from, to);
  if (next === content) {
    console.error(
      `Anchor not found in ${fileName}: ${JSON.stringify(from)}. Update scripts/postgenerate-llm-batch.ts.`
    );
    process.exit(1);
  }
  return next;
};

await transformFile(join(dir, 'batches-api.ts'), file =>
  file.replace(
    "* This API is part of the 'batch-service' service.",
    "* This API is part of the 'llm-batch' service.\n * @experimental This API is experimental and may change at any time without prior notice."
  )
);
console.log('batches-api.ts: processed successfully.');

// Assert each replacement actually matched. If the generator changes its
// output format (JSDoc wording, indentation), a silent no-op would revert
// the file to `model: string` without the LlmBatchModel import — fail loudly
// instead so the anchor can be updated.
await transformFile(join(dir, 'schema/batch-create-request.ts'), file => {
  const fileName = 'batch-create-request.ts';
  let next = replaceOrFail(
    file,
    "\n/**\n * Representation of the 'BatchCreateRequest' schema.\n */",
    "\nimport type { LlmBatchModel } from '@sap-ai-sdk/core';\n\n/**\n * Representation of the 'BatchCreateRequest' schema.\n */",
    fileName
  );
  next = replaceOrFail(
    next,
    '    model: string;',
    '    model: LlmBatchModel;',
    fileName
  );
  return next;
});
console.log('batch-create-request.ts: processed successfully.');
