/* oxlint-disable no-console */
import { resolve, basename } from 'node:path';
import { transformFile } from './util.ts';

const filePaths = process.argv.slice(2);

if (!filePaths.length) {
  console.error('Please provide at least one API file path as an argument.');
  process.exit(1);
}

const replaceOrFail = (content: string, from: string, to: string, fileName: string): string => {
  const next = content.replace(from, to);
  if (next === content) {
    console.error(
      `Anchor not found in ${fileName}: ${JSON.stringify(from)}. Update scripts/postgenerate-llm-batch.ts.`
    );
    process.exit(1);
  }
  return next;
};

for (const filePath of filePaths) {
  const resolvedPath = resolve(filePath);
  const fileName = basename(resolvedPath);

  if (fileName === 'batches-api.ts') {
    await transformFile(resolvedPath, file =>
      file.replace(
        "* This API is part of the 'batch-service' service.",
        "* This API is part of the 'llm-batch' service.\n * @experimental This API is experimental and may change at any time without prior notice."
      )
    );
  } else if (fileName === 'batch-create-request.ts') {
    // Assert each replacement actually matched. If the generator changes its
    // output format (JSDoc wording, indentation), a silent no-op would revert
    // the file to `model: string` without the LlmBatchModel import — fail loudly
    // instead so the anchor can be updated.
    await transformFile(resolvedPath, file => {
      let next = replaceOrFail(
        file,
        "\n/**\n * Representation of the 'BatchCreateRequest' schema.\n */",
        "\nimport type { LlmBatchModel } from '@sap-ai-sdk/core';\n\n/**\n * Representation of the 'BatchCreateRequest' schema.\n */",
        fileName
      );
      next = replaceOrFail(next, '    model: string;', '    model: LlmBatchModel;', fileName);
      return next;
    });
  } else {
    console.error(`Unknown file: ${fileName}`);
    process.exit(1);
  }

  console.log(`${fileName}: processed successfully.`);
}
