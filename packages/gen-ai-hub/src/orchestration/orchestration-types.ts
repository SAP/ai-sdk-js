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

/** Temporary placeholder interface for Masking Config.*/
export interface MaskingConfig {
  /**
   * Anonymize.
   */
  anonymize?: Record<string, any>;
  /**
   * Pseudonymize.
   */
  pseudonymize?: Record<string, any>;
}

/**
 * Enum for possible orchestration config modules.
 */
enum Module {
  Filtering,
  Masking
}

/**
 * Wrapper object for filtering module configuration.
 */
export interface FilterModuleConfig {
  /** Differentiator property. */
  type: Module.Filtering;
  /** Filtering configuration. */
  filterConfig: FilterConfig;
}

/**
 * Wrapper object for masking module configuration.
 */
export interface MaskingModuleConfig {
  /** Differentiator property. */
  type: Module.Masking;
  /** Masking configuration. */
  maskingConfig: MaskingConfig;
}
