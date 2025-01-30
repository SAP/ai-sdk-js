import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';
import type { ChatModel } from './model-types.js';
import type {
  ChatMessages,
  DataRepositoryType,
  DocumentGroundingFilter,
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
  /**
   * Global streaming options.
   */
  streaming?: GlobalStreamOptions;
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

/**
 * Represents a filter configuration for the Document Grounding Service.
 */
export type DocumentGroundingServiceFilter = Omit<
  DocumentGroundingFilter,
  'data_repository_type'
> & {
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

/**
 * Filter configuration for Azure content safety Filter.
 */
export interface AzureContentFilter {
  /**
   * The filter category for hate content.
   */
  Hate?: AzureFilterThreshold;
  /**
   * The filter category for self-harm content.
   */
  SelfHarm?: AzureFilterThreshold;
  /**
   * The filter category for sexual content.
   */
  Sexual?: AzureFilterThreshold;
  /**
   * The filter category for violence content.
   */
  Violence?: AzureFilterThreshold;
}

/**
 * A descriptive constant for Azure content safety filter threshold.
 */
export const azureFilterThreshold = {
  ALLOW_SAFE: 0,
  ALLOW_SAFE_LOW: 2,
  ALLOW_SAFE_LOW_MEDIUM: 4,
  ALLOW_ALL: 6
} as const;

/**
 * The Azure threshold level supported for each azure content filter category.
 */
export type AzureFilterThreshold = keyof typeof azureFilterThreshold;
