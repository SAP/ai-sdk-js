import { describe, it, expect } from 'vitest';
import { retiredOrExcludedBatchModels, type ModelRow } from './sync-model-types.ts';

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

describe('retiredOrExcludedBatchModels', () => {
  it('flags a batch model in the exclusion list even without a matching row', () => {
    // gpt-4.1-nano is in MODEL_EXCLUSION_LIST; its row is not retired by date,
    // so only the exclusion branch catches it.
    expect(retiredOrExcludedBatchModels([], ['gpt-4.1-nano'])).toEqual([
      'gpt-4.1-nano'
    ]);
  });

  it('flags a batch model whose row is deprecated', () => {
    const rows = [row({ model: 'some-batch-model', deprecated: 'yes' })];
    expect(retiredOrExcludedBatchModels(rows, ['some-batch-model'])).toEqual([
      'some-batch-model'
    ]);
  });

  it('flags a batch model whose row is retired', () => {
    const rows = [row({ model: 'some-batch-model', retired: 'yes' })];
    expect(retiredOrExcludedBatchModels(rows, ['some-batch-model'])).toEqual([
      'some-batch-model'
    ]);
  });

  it('flags a batch model whose retirement date has already passed', () => {
    // Fixed past date keeps this deterministic regardless of the current date.
    const rows = [row({ model: 'some-batch-model', retirementDate: '2000-01-01' })];
    expect(retiredOrExcludedBatchModels(rows, ['some-batch-model'])).toEqual([
      'some-batch-model'
    ]);
  });

  it('does not flag an active, non-excluded batch model', () => {
    const rows = [row({ model: 'active-batch-model' })];
    expect(retiredOrExcludedBatchModels(rows, ['active-batch-model'])).toEqual([]);
  });

  it('does not flag a batch model with no matching row and not excluded', () => {
    expect(retiredOrExcludedBatchModels([], ['unknown-batch-model'])).toEqual([]);
  });

  it('returns nothing for an empty batchModels array', () => {
    const rows = [row({ model: 'some-batch-model', deprecated: 'yes' })];
    expect(retiredOrExcludedBatchModels(rows, [])).toEqual([]);
  });
});
