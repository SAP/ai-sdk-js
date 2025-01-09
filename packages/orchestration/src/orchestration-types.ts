import type { ChatModel } from './model-types.js';
import type {
  ChatMessages,
  DataRepositoryType,
  DocumentGroundingFilter,
  FilteringModuleConfig,
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
 * Represents a filter configuration for the Document Grounding Service.
 */
export type DocumentGroundingServiceFilter = Omit<
  DocumentGroundingFilter, 'data_repository_type'> & {
  /**
   * Defines the type of data repository.
   * If not set, the default value is 'vector'.
   */
  data_repository_type?: DataRepositoryType;
};

/**
 * Represents the configuration for the Document Grounding Service.
 */
export interface DocumentGroundingServiceConfig {
  /**
   * Defines the filters to apply during the grounding process.
   */
  filters?: DocumentGroundingServiceFilter[];
  /**
   * Contains the input parameters used for grounding input questions.
   */
  input_params: string[];
  /**
   * Parameter name used for grounding output.
   * @example "groundingOutput"
   */
  output_param: string;
}
