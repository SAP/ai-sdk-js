import { isInlineTemplate } from './orchestration-types.ts';

describe('isInlineTemplate', () => {
  it('returns false for undefined', () => {
    expect(isInlineTemplate(undefined)).toBe(false);
  });

  it('returns false for a string prompt', () => {
    expect(isInlineTemplate('some yaml string')).toBe(false);
  });

  it('returns false for a TemplateRef (has template_ref)', () => {
    expect(isInlineTemplate({ template_ref: { id: 'abc123' } } as any)).toBe(
      false
    );
  });

  it('returns false for an object with an empty template array', () => {
    expect(isInlineTemplate({ template: [] })).toBe(false);
  });

  it('returns true for an object with a non-empty template array', () => {
    expect(
      isInlineTemplate({
        template: [{ role: 'system', content: 'You are helpful.' }]
      })
    ).toBe(true);
  });

  it('returns false when template_ref is present even if template is also set', () => {
    expect(
      isInlineTemplate({
        template_ref: { id: 'abc123' },
        template: [{ role: 'user', content: 'hello' }]
      } as any)
    ).toBe(false);
  });
});
