/* oxlint-disable no-console */
import { resolve } from 'node:path';

import { transformFile } from './util.ts';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the API file path as an argument.');
  process.exit(1);
}

const anchor = "* This API is part of the 'tabular-orchestration' service.";

await transformFile(resolve(filePath), file => {
  if (!file.includes(anchor)) {
    console.error(
      `Anchor not found in ${filePath}: ${JSON.stringify(anchor)}. Update scripts/postgenerate-tabular-orchestration.ts.`
    );
    process.exit(1);
  }
  return file.replace(
    anchor,
    `${anchor}\n * @experimental This API is experimental and may change at any time without prior notice.`
  );
});
console.log('File processed successfully.');
