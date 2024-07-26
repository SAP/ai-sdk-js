import { BaseLlmParameters } from '../core/index.js';
import {
  AzureContentSafety,
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
 * Response for GenAI hub chat completion.
 */
export type GenAiHubCompletionResponse = CompletionPostResponse;
/**
 * Wrapper object to configure prompt.
 */
export interface PromptConfig {
  /**
   * History.
   */
  messages_history?: ChatMessages;
  /**
   * Template.
   */
  template: ChatMessages;
  /**
   * Template Parameters.
   */
  template_params?: Record<string, InputParamsEntry>;
}

/**
 * Wrapper object to configure LLMModule.
 */
export type LlmConfig = LLMModuleConfig;

/**
 * Wrapper object to configure Filters.
 */
export interface FilterConfig {
  /**
   * Input configuration for filtering provider.
   */
  input?: FilterServiceProvider | FilterServiceProvider[];
  /**
   * Output configuration for filtering provider.
   */
  output?: FilterServiceProvider | FilterServiceProvider[];
}
/**
 * Wrapper object to configure the filter service provider.
 */
export type FilterServiceProvider =
  | { AzureContentSafety: AzureContentSafety; SomeOtherServiceProvider?: never }
  | {
      SomeOtherServiceProvider: AzureContentSafety;
      AzureContentSafety?: never;
    };
/**
 * Wrapper object to encompass Orchestration options.
 */
export interface OrchestrationCompletionParameters {
  /**
   * Prompt configuration options.
   */
  prompt: PromptConfig;
  /**
   * Llm configuration options.
   */
  llmConfig: LlmConfig;
  /**
   * Filter configuration options.
   */
  filterConfig?: FilterConfig;
}
