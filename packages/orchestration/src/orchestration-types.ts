import type { Xor } from '@sap-cloud-sdk/util';
import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';
import type { ChatModel } from './model-types.js';
import type {
  ChatMessages,
  DataRepositoryType,
  DocumentGroundingFilter,
  DpiConfig,
  DpiEntities,
  FilteringStreamOptions,
  LlamaGuard38B,
  LLMModelDetails as OriginalLLMModelDetails,
  Template,
  TemplateRef,
  TemplatingChatMessage,
  AzureContentSafetyOutput,
  AzureContentSafetyOutputFilterConfig,
  DPIStandardEntity,
  DPICustomEntity,
  InputFilteringConfig,
  OutputFilteringConfig,
  MaskingProviderConfig,
  SAPDocumentTranslation,
  GlobalStreamOptions,
  ErrorResponse,
  GroundingModuleConfig,
  LlamaGuard38BFilterConfig
} from './client/api/schema/index.js';

/**
 * Chat completion request configuration.
 */
export interface ChatCompletionRequest {
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
   * placeholderValues: {
   *   product: 'SAP Cloud SDK'
   * }
   */
  placeholderValues?: Record<string, string>;
}

/**
 * LLM model details.
 */
export type LlmModelDetails = Omit<
  OriginalLLMModelDetails,
  'name' | 'params'
> & {
  name: ChatModel;
  params?: LlmModelParams;
};

/**
 * Prompt templating module configuration.
 */
export interface PromptTemplatingModule {
  /**
   * The prompt template to be used. Can be either a user defined template or a reference to a template in the prompt registry.
   */
  /**
   * Static prompts. Can be:
   * - A `template`: an array of templated chat messages (with {{?placeholders}}).
   * - An `id` or `scenario`, `name` and `version`: reference to a remote prompt template.
   *
   * This is meant for static instructions included with every call.
   * For per-request templating, use `messages` in `.chatCompletion()` instead.
   * @example
   * prompt: {
   *   template: [
   *     {
   *       role: 'system',
   *       content: 'You are an assistant for {{?product}}.'
   *     }
   *   ]
   * }
   */
  prompt?: Xor<PromptTemplate, TemplateRef> | string;
  /**
   * LLM model details.
   */
  model: LlmModelDetails;
}

/**
 * Representation of the 'FilteringModuleConfig' schema.
 */
export interface FilteringModule {
  /**
   * List of provider type and filters.
   */
  input?: InputFilteringConfig;
  /**
   * List of provider type and filters.
   */
  output?: OutputFilteringConfig;
}

/**
 * Representation of the 'MaskingModuleConfig' schema.
 */
export interface MaskingModule {
  /**
   * List of masking service providers
   * Min Items: 1.
   */
  masking_providers: MaskingProviderConfig[];
}

/**
 * Representation of the 'GroundingModuleConfig' schema.
 */
export interface GroundingModule {
  /**
   * @example "document_grounding_service"
   */
  type: 'document_grounding_service' | any;
  /**
   * Grounding service configuration.
   */
  config: {
    /**
     * Document grounding service filters to be used.
     */
    filters?: DocumentGroundingFilter[];
    /**
     * Placeholders to be used for grounding input questions and output.
     */
    placeholders: {
      /**
       * Contains the input parameters used for grounding input questions
       * Min Items: 1.
       */
      input: string[];
      /**
       * Placeholder name for grounding output.
       * @example "groundingOutput"
       */
      output: string;
    };
    /**
     * Parameter name used for specifying metadata parameters.
     */
    metadata_params?: string[];
  };
}

/**
 * Configuration for translation module.
 */
export interface TranslationModule {
  /**
   * Configuration for input translation.
   */
  input?: SAPDocumentTranslation;
  /**
   * Configuration for output translation.
   */
  output?: SAPDocumentTranslation;
}

/**
 * Orchestration error response.
 */
export type OrchestrationErrorResponse = ErrorResponse;

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
export type PromptTemplate = Omit<Template, 'template'> & {
  /**
   * A chat message array to be formatted with values from `placeholderValues`.
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
 * Orchestration module configuration.
 */
export interface OrchestrationModuleConfig {
  /**
   * Prompt templating configuration.
   */
  promptTemplating: PromptTemplatingModule;
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
  filtering?: FilteringModule;
  /**
   * Masking module configuration.
   */
  masking?: MaskingModule;
  /**
   * Grounding module configuraton.
   */
  grounding?: GroundingModule;
  /**
   * Translation module configuration.
   */
  translation?: TranslationModule;
}

/**
 * Request options for orchestration.
 */
export interface RequestOptions {
  /**
   * Prompt configuration.
   */
  request?: ChatCompletionRequest;
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
  promptTemplating?: { include_usage?: boolean; [key: string]: any } | null;
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
   * Document grounding service filters to be used.
   */
  filters?: DocumentGroundingServiceFilter[];
  /**
   * Placeholders to be used for grounding input questions and output.
   */
  placeholders: {
    /**
     * Contains the input parameters used for grounding input questions
     * Min Items: 1.
     */
    input: string[];
    /**
     * Placeholder name for grounding output.
     * @example "groundingOutput"
     */
    output: string;
  };
  /**
   * Parameter name used for specifying metadata parameters.
   */
  metadata_params?: string[];
}

/**
 * Defines the type of the DPI masking entity.
 */
type DpiEntity =
  | DpiEntities
  | DPIStandardEntity
  | (DPICustomEntity & {
      type: 'custom';
    });

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
  hate?: AzureFilterThreshold;
  /**
   * The filter category for self-harm content.
   */
  self_harm?: AzureFilterThreshold;
  /**
   * The filter category for sexual content.
   */
  sexual?: AzureFilterThreshold;
  /**
   * The filter category for violence content.
   */
  violence?: AzureFilterThreshold;
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

/**
 * Representation of the 'LlamaGuard38BFilterConfig' schema.
 */
export type LlamaGuardFilterConfig = LlamaGuard38BFilterConfig;

/**
 * Representation of the 'GroundingModuleConfig' schema.
 */
export type DocumentGroundingConfig = GroundingModuleConfig;

/**
 * Representation of the 'DpiConfig' schema.
 */
export type DpiMaskingProviderConfig = DpiConfig;

/**
 * Representation of the 'SAPDocumentTranslation' schema.
 */
export type TranslationConfig = SAPDocumentTranslation;
