import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';
import type { ChatModel } from './model-types.js';
import type {
  ChatMessages,
  DataRepositoryType,
  DocumentGroundingFilter,
  DpiConfig,
  DpiEntities,
  FilteringModuleConfig,
  FilteringStreamOptions,
  GlobalStreamOptions,
  GroundingModuleConfig,
  LlamaGuard38B,
  MaskingModuleConfig,
  LlmModuleConfig as OriginalLlmModuleConfig,
  Template as OriginalTemplate,
  TemplateRef,
  TemplatingChatMessage
} from './client/api/schema/index.js';

/**
 * Prompt configuration.
 */
export interface Prompt {
  /**
   * History.
   * @deprecated since 1.14.0. Use `messages` instead.
   */
  messagesHistory?: ChatMessages;

  /**
   * Chat messages, including the message history.
   */
  messages?: ChatMessages;

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

// export type TemplatingModuleConfigNew = Omit<TemplatingModuleConfig, 'template'> & {
//   template?: TemplatingChatMessage;
// }

export type Template = Omit<OriginalTemplate, 'template'> & {
  template?: TemplatingChatMessage;  // Make `template` optional
};

// TemplatingModuleConfig should reflect this change
export type TemplatingModuleConfig = Template | TemplateRef;  // No change needed

/**
 * Orchestration module configuration.
 */
export interface OrchestrationModuleConfig {
  /**
   * Templating module configuration can be a template or a template reference.
   * If a template is provided, it will be used to format the input parameters.
   * If a template reference is provided, it will be used to reference a template.
   * @example
   * templating: {
   *  template: [
   *    {
   *     role: 'user',
   *    content: 'How can the features of AI in SAP BTP specifically {{?groundingOutput}}, be applied to {{?inputContext}}'
   *   }
   *  ]
   * }
   */
  templating?: TemplatingModuleConfig | string;
  /**
   * LLM module configuration.
   */
  llm: LlmModuleConfig;
  /**
   * Filtering module configuration for both input and output filters.
   * To configure a filter, use convenience functions like `buildAzureContentSafetyFilter`, `buildLlamaGuardFilter`, etc..
   * @example
   * filtering: {
   *   input: {
   *     filters: [
   *       buildAzureContentSafetyFilter({ Hate: 'ALLOW_SAFE', Violence: 'ALLOW_SAFE_LOW_MEDIUM' })
   *     ]
   *   }
   * }
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
  /**
   * Parameter name used for specifying metadata parameters.
   */
  metadata_params?: string[];
}

/**
 * Represents the configuration for the masking provider SAP Data Privacy Integration.
 */
export type DpiMaskingConfig = Omit<
  DpiConfig,
  'type' | 'entities' | 'mask_grounding_input'
> & {
  entities: [DpiEntities, ...DpiEntities[]];
  mask_grounding_input?: boolean;
};

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
 * @internal
 */
export const supportedAzureFilterThresholds = {
  ALLOW_SAFE: 0,
  ALLOW_SAFE_LOW: 2,
  ALLOW_SAFE_LOW_MEDIUM: 4,
  ALLOW_ALL: 6
} as const;

/**
 * The Azure threshold level supported for each azure content filter category.
 *
 */
export type AzureFilterThreshold = keyof typeof supportedAzureFilterThresholds;

/**
 * The filter categories supported for Llama guard filter.
 */
export type LlamaGuardCategory = keyof LlamaGuard38B;

const t: TemplatingModuleConfig = {
  defaults: {
    inputContext: 'The default text that will be used in the template if inputContext is not set'
  }
}