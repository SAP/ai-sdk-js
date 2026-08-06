import type { SnapshotSerializer } from 'vitest';
import { isErrorWithCause } from '@sap-cloud-sdk/util';

export default {
  test(val) {
    return val instanceof Error && isErrorWithCause(val);
  },
  serialize(val, config, indentation, depth, refs, printer) {
    const indent = `${indentation}  `;
    const message = printer(val.message, config, indent, depth + 1, refs);
    const cause = printer(val.cause, config, indent, depth + 1, refs);
    return [
      'ErrorWithCause {',
      `${indent}"message": ${message},`,
      `${indent}"cause": ${cause},`,
      `${indentation}}`,
    ].join('\n');
  },
} satisfies SnapshotSerializer;
