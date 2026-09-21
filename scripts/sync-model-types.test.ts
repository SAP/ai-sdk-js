import { describe, it, expect } from 'vitest';
import { batchModelWarnings, type ModelRow } from './sync-model-types.ts';

function row(overrides: Partial<ModelRow> & { model: string }): ModelRow {
  return {
    executableId: 'azure-openai',
    version: '2024-01-01',
    availableInOrchestration: 'yes',
    deprecated: '',
    retirementDate: '',
    suggestedReplacement: '',
    ...overrides
  };
}

describe('batchModelWarnings', () => {
  it('warns for a batch model in the exclusion list even without a matching row', () => {
    // gpt-4.1-nano is in MODEL_EXCLUSION_LIST; its row is not retired by date,
    // so only the exclusion branch catches it.
    const warnings = batchModelWarnings([], ['gpt-4.1-nano']);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('gpt-4.1-nano');
  });

  it('warns for a batch model whose row is deprecated', () => {
    const rows = [row({ model: 'some-batch-model', deprecated: 'yes' })];
    const warnings = batchModelWarnings(rows, ['some-batch-model']);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('some-batch-model');
  });

  it('warns for a batch model whose row is retired', () => {
    const rows = [row({ model: 'some-batch-model', retired: 'yes' })];
    const warnings = batchModelWarnings(rows, ['some-batch-model']);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('some-batch-model');
  });

  it('warns for a batch model whose retirement date has already passed', () => {
    // Fixed past date keeps this deterministic regardless of the current date.
    const rows = [row({ model: 'some-batch-model', retirementDate: '2000-01-01' })];
    const warnings = batchModelWarnings(rows, ['some-batch-model']);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('some-batch-model');
  });

  it('does not warn for an active, non-excluded batch model', () => {
    const rows = [row({ model: 'active-batch-model' })];
    expect(batchModelWarnings(rows, ['active-batch-model'])).toEqual([]);
  });

  it('does not warn for a batch model with no matching row and not excluded', () => {
    expect(batchModelWarnings([], ['unknown-batch-model'])).toEqual([]);
  });

  it('returns no warnings for an empty batchModels array', () => {
    const rows = [row({ model: 'some-batch-model', deprecated: 'yes' })];
    expect(batchModelWarnings(rows, [])).toEqual([]);
  });
});
