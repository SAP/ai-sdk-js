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
export type LlmModuleConfig = LLMModuleConfig & {
  /** */
  model_name: ChatModel;
};

/**
 * Orchestration module configuration.
 */
export interface OrchestrationModuleConfig {
  /**
   * Templating module configuration.
   */
  templating: TemplatingModuleConfig;
  /**
   * LLM module configuration.
   */
  llm: LlmModuleConfig;
  /**
   * Filtering module configuration.
   */
  filtering?: FilteringModuleConfig;
}
