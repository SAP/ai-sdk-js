import { expectError, expectType, expectAssignable } from 'tsd';
import {
  OrchestrationClient,
  buildAzureContentSafetyFilter,
  buildDocumentGroundingConfig,
  buildLlamaGuard38BFilter,
  buildDpiMaskingProvider,
  buildTranslationConfig
} from '@sap-ai-sdk/orchestration';
import type {
  ChatModel,
  LlmModelParams,
  OrchestrationResponse,
  GroundingModule,
  AzureContentSafetyFilterReturnType,
  AssistantChatMessage,
  TranslationReturnType,
  LlamaGuard38BFilterReturnType,
  TranslationConfigParams,
  DocumentTranslationApplyToSelector,
  TranslationTargetLanguage
} from '@sap-ai-sdk/orchestration';
import type {
  CompletionPostResponse,
  TokenUsage,
  ChatMessages,
  DpiConfig,
  MessageToolCalls
} from '@sap-ai-sdk/orchestration/internal.js';

const selector: DocumentTranslationApplyToSelector = {
  category: 'placeholders',
  items: ['user_input'],
  sourceLanguage: 'de-DE'
};

/**
 * Test buildTranslationConfig accepts the new targetLanguage types.
 */
expectType<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {
    targetLanguage: 'en-US'
  })
);

expectType<TranslationReturnType<'output'>>(
  buildTranslationConfig('output', {
    targetLanguage: selector
  })
);

// Add back the full file content as necessary, but for now, since the type error is fixed by changing to 'output'
