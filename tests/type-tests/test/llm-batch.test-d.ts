import { expectType, expectAssignable } from 'tsd';
import type { LlmBatchModel } from '@sap-ai-sdk/llm-batch';
import type { BatchCreateRequest } from '@sap-ai-sdk/llm-batch';
import type { LlmBatchModel as LlmBatchModelFromCore } from '@sap-ai-sdk/core';

// LlmBatchModel accepts known model strings
expectAssignable<LlmBatchModel>('gpt-4.1-nano');

// LlmBatchModel accepts arbitrary strings (LiteralUnion extends string)
expectAssignable<LlmBatchModel>('any-future-batch-model');

// LlmBatchModel is defined in @sap-ai-sdk/core and also usable directly from there
expectAssignable<LlmBatchModelFromCore>('gpt-5');

// BatchCreateRequest.spec.model is LlmBatchModel (not plain string)
const req: BatchCreateRequest = {
  type: 'llm-native',
  input: { uri: 's3://input.jsonl' },
  output: { uri: 's3://output/' },
  spec: { provider: 'azure-openai', model: 'gpt-4.1-nano' }
};
expectType<LlmBatchModel>(req.spec.model);
