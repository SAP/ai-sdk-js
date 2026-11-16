import { describe, expect, it } from 'vitest';

import { parseContent } from './parse-content.ts';

describe('parseContent', () => {
  it('parses hashless and legacy entries while ignoring dependency metadata', () => {
    const content = `### Minor Changes

- [feat] Add the first model.
- [Improvement] Retire a model (retirement date: 2026-10-30).
- abc1234: [fix] Preserve legacy entries.

### Patch Changes

- Updated dependencies [abc1234]
  - @sap-ai-sdk/core@2.17.0`;

    expect(parseContent(content, '2.17.0', 'core')).toEqual([
      {
        commit: '',
        packageNames: ['core'],
        summary: 'Add the first model.',
        type: expect.objectContaining({ name: 'feat' }),
        version: '2.17.0'
      },
      {
        commit: '',
        packageNames: ['core'],
        summary: 'Retire a model (retirement date: 2026-10-30).',
        type: expect.objectContaining({ name: 'impr' }),
        version: '2.17.0'
      },
      {
        commit: '(abc1234)',
        packageNames: ['core'],
        summary: 'Preserve legacy entries.',
        type: expect.objectContaining({ name: 'fix' }),
        version: '2.17.0'
      }
    ]);
  });

  it('rejects an untyped changelog entry', () => {
    expect(() =>
      parseContent(
        '- Retire a model (retirement date: 2026-10-30).',
        '2.17.0',
        'core'
      )
    ).toThrow('Missing message type');
  });
});
