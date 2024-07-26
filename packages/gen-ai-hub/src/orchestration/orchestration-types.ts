import { BaseLlmParameters } from '../core/index.js';
import {
  AzureContentSafety,
  ChatMessages,
  CompletionPostResponse,
  InputParamsEntry,
  LLMModuleConfig,
  ProviderType
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
  input?: FilterServiceProvider;
  /**
   * Output configuration for filtering provider.
   */
  output?: FilterServiceProvider;
}
/**
 * Wrapper object to configure the filter service provider.
 */
export interface FilterServiceProvider {
  /**
   * Azure content safery filter service provider.
   */
  azureContentSafety?: AzureContentSafety;
}
/**
 * Map of filter service providers.
 */
export const filterServiceProviders: { [key: string]: ProviderType } = {
  azureContentSafety: 'azure_content_safety'
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
