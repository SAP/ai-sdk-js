import {
  ChatMessages,
  FilteringModuleConfig,
  InputParamsEntry,
  LLMModuleConfig,
  TemplatingModuleConfig
} from './client/api/index.js';

/**
 * Prompt configuration.
 */
export interface Prompt {
  /**
   * History.
   */
  messagesHistory?: ChatMessages;

  /**
   * Template parameters.
   */
  inputParams?: Record<string, InputParamsEntry>;
}

// TODO: why do we have this extra type? and if there is a reason, why does it not apply to the filtering module?
/**
 * LLMModule configuration.
 */
export type LlmConfig = LLMModuleConfig;

/**
 * Orchestration module configuration.
 */
export interface OrchestrationModuleConfig {
  // TODO: remove "config" for all the configs below
  /**
   * Templating configuration options.
   */
  templatingConfig: TemplatingModuleConfig;
  /**
   * Llm configuration options.
   */
  llmConfig: LlmConfig;
  /**
   * Filter configuration options.
   */
  filterConfig?: FilteringModuleConfig;
}
