import type { Xor } from '@sap-cloud-sdk/util';
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
  InputTranslationModuleConfig,
  LlamaGuard38B,
  MaskingModuleConfig,
  LlmModuleConfig as OriginalLlmModuleConfig,
  Template as OriginalTemplate,
  TemplateRef,
  TemplatingChatMessage,
  OutputTranslationModuleConfig,
  AzureContentSafetyOutput,
  AzureContentSafetyOutputFilterConfig,
  DPIStandardEntity,
  DPICustomEntity
} from './client/api/schema/index.js';

/**
 * Prompt configuration.
 */
export interface Prompt {
  /**
   * Chat History.
   */
  messagesHistory?: ChatMessages;

  /**
   * New chat messages, including template messages.
   * @example
   * messages: [
   *   {
   *     role: 'system',
   *     content: 'You are a helpful assistant answering questions about {{product}}.'
   *   },
   *   {
   *     role: 'user',
   *     content: 'Can you give me an overview of its key benefits?'
   *   }
   * ]
   */
  messages?: ChatMessages;

  /**
   * Template parameters.
   * @example
   * inputParams: {
   *   product: 'SAP Cloud SDK'
   * }
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
 * Representation of the 'Template' schema.
 */
export type Template = Omit<OriginalTemplate, 'template'> & {
  /**
   * A chat message array to be formatted with values from `inputParams`.
   * Both `role` and `content` can use {{?variable}} placeholders.
   *
   * For dynamic templating (changing per request), pass templated messages directly in `.chatCompletion({ messages })`.
   * @example
   * // Static template: passed once in client config
   * templating: {
   *   template: [
   *     {
   *       role: 'system',
   *       content: 'You are a helpful assistant for {{?product}}.'
   *     }
   *   ]
   * }
   */
  template?: TemplatingChatMessage;
};

/**
 * Representation of the 'TemplatingModuleConfig' schema.
 * The type can be either a `Template` or a `TemplateRef`.
 */
export type TemplatingModuleConfig = Xor<Template, TemplateRef>;

/**
 * Orchestration module configuration.
 */
export interface OrchestrationModuleConfig {
  /**
   * Templating configuration for static prompts. Can be:
   * - A `template`: an array of templated chat messages (with {{?placeholders}}).
   * - An `id` or `scenario`, `name` and `version`: reference to a remote prompt template.
   *
   * This is meant for static instructions included with every call.
   * For per-request templating, use `messages` in `.chatCompletion()` instead.
   * @example
   * templating: {
   *   template: [
   *     {
   *       role: 'system',
   *       content: 'You are an assistant for {{?product}}.'
   *     }
   *   ]
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
  /**
   * Input translation module configuration.
   */
  inputTranslation?: InputTranslationModuleConfig;
  /**
   * Output translation module configuration.
   */
  outputTranslation?: OutputTranslationModuleConfig;
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
 * Represents a standard entity for DPI Masking Config.
 */
export type StandardEntity = DPIStandardEntity & {
  kind: 'standard-entity';
};

/**
 * Represents a custom entity for DPI Masking Config.
 */
export type CustomEntity = DPICustomEntity & {
  kind: 'custom-entity';
};

/**
 * Defines the type of the DPI masking entity .
 */
export type DpiEntity = DpiEntities | StandardEntity | CustomEntity;

/**
 * Represents the configuration for the masking provider SAP Data Privacy Integration.
 */
export type DpiMaskingConfig = Omit<
  DpiConfig,
  'type' | 'entities' | 'mask_grounding_input'
> & {
  entities: [DpiEntity, ...DpiEntity[]];
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

/**
 * Translation configuration for SAP Document Translation.
 * See https://help.sap.com/docs/translation-hub/sap-translation-hub/supported-languages-6854bbb1bd824ffebc3a097a7c0fd45d for list of supported languages.
 */
export interface TranslationConfigParams {
  /**
   * Language of the text to be translated.
   * @example sourceLanguage: "de-DE"
   */
  sourceLanguage?: string;
  /**
   * Language to which the text should be translated.
   * @example targetLanguage: "en-US"
   */
  targetLanguage: string;
}

/**
 * Filter configuration for Azure Content Safety.
 */
export type AzureContentSafety = AzureContentSafetyOutput;

/**
 * Representation of the Azure Content Safety filter config schema.
 */
export type AzureContentSafetyFilterConfig =
  AzureContentSafetyOutputFilterConfig;
