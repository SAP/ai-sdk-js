import { setFailed } from '@actions/core';
import { context } from '@actions/github';

import { validateTitle, validateBody } from './validators.ts';

try {
  await validateTitle(context.payload.pull_request?.title);
  await validateBody(
    context.payload.pull_request?.body?.replace(/\r\n/g, '\n')
  );
} catch (err: any) {
  setFailed(err);
}
