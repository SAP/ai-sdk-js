import type { Xor } from '@sap-cloud-sdk/util';

import type {
  ChatMessages,
  LLMModelDetails,
  Template,
  TemplateRefByID,
  TemplateRefByScenarioNameVersion
} from '../../client/api/schema/index.ts';
import type { ChatModel } from '../../model-types.ts';
import type { LlmModelParams } from '../../orchestration-types.ts';

export type LlmModelDetailsWithStreaming = Omit<
  LLMModelDetails,
  'name' | 'params'
> & {
  /**
   * The name of the model to use.
   * In addition to the listed {@link ChatModel} values, any string is accepted,
   * allowing use of models not yet included in the SDK's type definitions:.
   * ```ts
   * model: { name: 'my-custom-model-name' }
   * ```
   */
  name: ChatModel;
  params?: LlmModelParams & {
    stream_options: { include_usage?: boolean; [key: string]: any } | null;
  };
};

/**
 * The model to use for a request, as either the full {@link LlmModelDetails} object or a bare model-name shorthand.
 * A string `'amazon--nova-lite'` is accepted as shorthand for `{ name: 'amazon--nova-lite' }`.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationModelOption = ChatModel | LlmModelDetailsWithStreaming;

/**
 * Prompt-templating options supplied per call to the callable builder's `create`, excluding the inline `template`.
 * The inline template content is passed through `messages` instead; these carry the remaining templating options (`defaults`, `response_format`, `tools`) directly at the top level.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationInlinePromptOptionsBase = Omit<
  Template,
  'template'
> & {
  model: OrchestrationModelOption;
};

export interface Messages {
  /**
   * Chat messages for this fallback, including templated messages with `{{?placeholder}}` variables.
   */
  messages: ChatMessages;
}

export interface TemplateRef {
  templateRef: TemplateRefByID | TemplateRefByScenarioNameVersion;
}

export type OrchestrationInlinePromptOptionsWithMessages =
  OrchestrationInlinePromptOptionsBase & Messages;

export type OrchestrationInlinePromptOptionsWithTemplateRef =
  OrchestrationInlinePromptOptionsBase & TemplateRef;

export type OrchestrationInlinePromptOptions = Xor<
  OrchestrationInlinePromptOptionsWithMessages,
  OrchestrationInlinePromptOptionsWithTemplateRef
>;
