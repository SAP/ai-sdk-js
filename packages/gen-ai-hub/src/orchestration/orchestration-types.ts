import { BaseLlmParameters } from '../core/index.js';
import {
  ChatMessages,
  CompletionPostResponse,
  InputParamsEntry,
  LLMModuleConfig
} from './api/index.js';

/**
 * Input Parameters for GenAI hub chat completion.
 */
export type GenAiHubCompletionParameters = BaseLlmParameters &
  OrchestrationCompletionParameters;

/**
 * Response o for GenAI hub chat completion.
 */
export type GenAiHubCompletionPostResponse = CompletionPostResponse;
/**
 * Prompt object builder.
 */
export interface PromptOptions {
  /**
   * History.
   */
  messages_history?: ChatMessages;
  /**
   * Template.
   */
  template: ChatMessages;
  /**
   * Template.
   */
  template_params?: Record<string, InputParamsEntry>;
}

/**
 * LlmOptions.
 */
export type LlmConfig = LLMModuleConfig;

/**
 * Orchestration options.
 */
export interface OrchestrationCompletionParameters {
  /**
   * Prompt options.
   */
  prompt: PromptOptions;
  /**
   * Llm configuration options.
   */
  llmConfig: LlmConfig;
}
