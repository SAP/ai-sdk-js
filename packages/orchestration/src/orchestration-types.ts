import { ChatModel } from './model-types.js';
import {
  ChatMessages,
  FilteringModuleConfig,
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
  inputParams?: Record<string, string>;
}

/**
 * LLMModule configuration.
 */
export type LlmConfig = LLMModuleConfig & {
  /** */
  model_name: ChatModel;
};

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
