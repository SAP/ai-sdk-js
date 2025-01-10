import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';
import type { ChatModel } from './model-types.js';
import type {
  ChatMessages,
  FilteringModuleConfig,
  FilteringStreamOptions,
  GlobalStreamOptions,
  GroundingModuleConfig,
  MaskingModuleConfig,
  LlmModuleConfig as OriginalLlmModuleConfig,
  TemplatingModuleConfig
} from './client/api/schema/index.js';

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
 * LLM module configuration.
 */
export type LlmModuleConfig = OriginalLlmModuleConfig & {
  /** */
  model_name: ChatModel;
  model_params?: LlmModelParams;
};

/**
 * Model Parameters for LLM module configuration.
 */
export type LlmModelParams = {
  max_tokens?: number;
  temperature?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  top_p?: number;
  n?: number;
} & Record<string, any>;

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
  /**
   * Masking module configuration.
   */
  masking?: MaskingModuleConfig;
  /**
   * Grounding module configuraton.
   */
  grounding?: GroundingModuleConfig;
}

/**
 * Request options for orchestration.
 */
export interface RequestOptions {
  /**
   * Prompt configuration.
   */
  prompt?: Prompt;
  /**
   * Custom request configuration.
   */
  requestConfig?: CustomRequestConfig;
  /**
   * Whether to stream the response.
   */
  stream?: boolean;
  /**
   * Options for the stream.
   */
  streamOptions?: StreamOptions;
}

/**
 * Options for the stream.
 */
export interface StreamOptions {
  /**
   * LLM specific stream options.
   */
  llm?: { include_usage?: boolean; [key: string]: any } | null;
  /**
   * Output filtering stream options.
   */
  outputFiltering?: FilteringStreamOptions;
  /**
   * Global stream options.
   */
  global?: GlobalStreamOptions;
}
