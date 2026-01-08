import type { Xor } from '@sap-cloud-sdk/util';
import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';
import type { ChatModel, EmbeddingModel } from './model-types.js';
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
  DPIStandardEntity,
  DPICustomEntity,
  InputFilteringConfig,
  OutputFilteringConfig,
  MaskingProviderConfig,
  GlobalStreamOptions,
  ErrorResponse,
  AzureContentSafetyInputFilterConfig,
  AzureContentSafetyOutputFilterConfig,
  LlamaGuard38BFilterConfig,
  EmbeddingsModelDetails as OriginalEmbeddingsModelDetails,
  EmbeddingsModelParams as OriginalEmbeddingsModelParams,
  SAPDocumentTranslationInput,
  SAPDocumentTranslationOutput
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
 * Representation of the `FilteringModuleConfig` schema.
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
 * Representation of the `MaskingModuleConfig` schema.
 */
export interface MaskingModule {
  /**
   * List of masking service providers
   * Min Items: 1.
   */
  masking_providers: MaskingProviderConfig[];
}

/**
 * Configuration for translation module.
 */
export interface TranslationModule {
  /**
   * Configuration for input translation.
   */
  input?: TranslationInputConfig;
  /**
   * Configuration for output translation.
   */
  output?: TranslationOutputConfig;
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
   * To configure a filter, use convenience functions like `buildAzureContentSafetyFilter`, `buildLlamaGuard38BFilter`, etc..
   * @example
   * filtering: {
   *   input: {
   *     filters: [
   *       buildAzureContentSafetyFilter('input', { hate: 'ALLOW_SAFE', violence: 'ALLOW_SAFE_LOW_MEDIUM' })
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
 * Reference to an orchestration configuration created via the Prompt Registry API.
 * Use this to reference a pre-configured orchestration setup without
 * defining the full configuration in code. The configuration must be
 * created via the Prompt Registry API before it can be referenced.
 * Reference by ID.
 * @example
 * const configRef: OrchestrationConfigRef = {
 *   id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
 * };
 * Reference by scenario, name and version.
 * @example
 * const configRef: OrchestrationConfigRef = {
 *   scenario: 'customer-support',
 *   name: 'example-orchestration-config',
 *   version: '0.0.1'
 * };
 */
export type OrchestrationConfigRef = Xor<
  {
    /** Orchestration configuration ID. */
    id: string;
  },
  {
    /** Scenario identifier. */
    scenario: string;
    /** Configuration name. */
    name: string;
    /** Configuration version. */
    version: string;
  }
>;

/**
 * Type guard to check if config is a config reference.
 * @param config - The config to check.
 * @returns Type predicate indicating whether the config is a config reference.
 */
export function isConfigReference(
  config: OrchestrationModuleConfig | string | OrchestrationConfigRef
): config is OrchestrationConfigRef {
  return (
    typeof config === 'object' &&
    ('id' in config ||
      ('scenario' in config && 'name' in config && 'version' in config))
  );
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
 * Representation of the `GroundingModuleConfig` schema.
 */
export interface GroundingModule {
  /**
   * @example 'document_grounding_service'
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
       * @example 'groundingOutput'
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

interface AzureContentSafetyFilterBaseParameters {
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
 * Output Parameters for Azure content safety output filter.
 */
export interface AzureContentSafetyFilterOutputParameters extends AzureContentSafetyFilterBaseParameters {
  /**
   * Detect protected code content from known GitHub repositories. The scan includes software libraries, source code, algorithms, and other proprietary programming content.
   */
  protected_material_code?: boolean;
}
/**
 * Input parameters for Azure content safety input filter.
 */
export interface AzureContentSafetyFilterInputParameters extends AzureContentSafetyFilterBaseParameters {
  /**
   * A flag to use prompt shield.
   */
  prompt_shield?: boolean;
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
 * The filter categories supported for Llama Guard 3 8B filter.
 */
export type LlamaGuard38BCategory = keyof LlamaGuard38B;

/**
 * Type for module configurations (input or output).
 * @internal
 */
export type ConfigType = 'input' | 'output';

/**
 * Category for translation application scope.
 */
export type TranslationApplyToCategory = 'placeholders' | 'template_roles';

/**
 * Configuration selector for applying translation to specific placeholders or message roles.
 */
export interface DocumentTranslationApplyToSelector {
  /**
   * Category to apply translation to.
   */
  category: TranslationApplyToCategory;
  /**
   * List of placeholders or roles to apply translation to.
   * @example [
   *   "groundingInput",
   *   "inputContext"
   * ]
   */
  items: string[];
  /**
   * Language of the text to be translated.
   * @example "de-DE"
   */
  sourceLanguage?: string;
}

/**
 * Target language for translation, either a language code or a selector configuration.
 */
export type TranslationTargetLanguage =
  | string
  | DocumentTranslationApplyToSelector;

/**
 * Input parameters for translation configuration.
 */
interface TranslationConfigParametersInput {
  /**
   * Language of the text to be translated.
   * @example sourceLanguage: 'de-DE'
   */
  sourceLanguage?: string;
  /**
   * Language to which the text should be translated.
   * @example targetLanguage: 'en-US'
   */
  targetLanguage: string;
  /**
   * If true, the messages history will be translated as well.
   * @default true
   */
  translateMessagesHistory?: boolean;
  /**
   * Configuration for applying translation to specific placeholders or message roles.
   * @example applyTo: [{ category: 'placeholders', items: ['user_input'], sourceLanguage: 'de-DE' }]
   */
  applyTo?: DocumentTranslationApplyToSelector[];
}

/**
 * Output parameters for translation configuration.
 */
interface TranslationConfigParametersOutput {
  /**
   * Language of the text to be translated.
   * @example sourceLanguage: 'de-DE'
   */
  sourceLanguage?: string;
  /**
   * Language to which the text should be translated.
   * @example targetLanguage: 'en-US'
   */
  targetLanguage: TranslationTargetLanguage;
}

/**
 * Output parameters for translation output configuration.
 */
export type TranslationOutputParameters = TranslationConfigParametersOutput;

/**
 * Input parameters for translation input configuration.
 */
export type TranslationInputParameters = TranslationConfigParametersInput;

/**
 * Parameters for translation configurations.
 */
export type TranslationConfigParams<T extends ConfigType> = T extends 'input'
  ? TranslationInputParameters
  : TranslationOutputParameters;

/**
 * Input configuration for translation module.
 */
export type TranslationInputConfig = SAPDocumentTranslationInput;

/**
 * Output configuration for translation module.
 */
export type TranslationOutputConfig = SAPDocumentTranslationOutput;

/**
 * Return type for translation configurations.
 */
export type TranslationReturnType<T extends ConfigType> = T extends 'input'
  ? TranslationInputConfig
  : TranslationOutputConfig;

/**
 * Parameters for Azure content safety filters.
 */
export type AzureContentSafetyFilterParameters<T extends ConfigType> =
  T extends 'input'
    ? AzureContentSafetyFilterInputParameters
    : AzureContentSafetyFilterOutputParameters;

/**
 * Filter return type for Azure Content Safety.
 */
export type AzureContentSafetyFilterReturnType<T extends ConfigType> =
  T extends 'input'
    ? AzureContentSafetyInputFilterConfig
    : AzureContentSafetyOutputFilterConfig;

/**
 * Input filter configuration for Llama Guard 3 8B.
 */
export type LlamaGuard38BInputFilterConfig = LlamaGuard38BFilterConfig;

/**
 * Output filter configuration for Llama Guard 3 8B.
 */
export type LlamaGuard38BOutputFilterConfig = LlamaGuard38BFilterConfig;

/**
 * Filter return type for Llama Guard 3 8B.
 */
export type LlamaGuard38BFilterReturnType<T extends ConfigType> =
  T extends 'input'
    ? LlamaGuard38BInputFilterConfig
    : LlamaGuard38BOutputFilterConfig;

/**
 * Representation of the 'DpiConfig' schema.
 */
export type DpiMaskingProviderConfig = DpiConfig;

/**
 * Embedding request configuration.
 */
export interface EmbeddingRequest {
  /**
   * Text input for which embeddings need to be generated.
   * Can be a single string or array of strings.
   * @example
   * input: "This is a text to embed" or
   * input: ["Text 1", "Text 2", "Text 3"]
   */
  input: string | string[];

  /**
   * Represents the task for which the embeddings need to be generated.
   * @default 'text'
   */
  type?: 'text' | 'document' | 'query';
}

/**
 * Embedding model details.
 */
export type EmbeddingModelDetails = Omit<
  OriginalEmbeddingsModelDetails,
  'name' | 'params'
> & {
  name: EmbeddingModel;
  params?: EmbeddingModelParams;
};

/**
 * Embedding model parameters.
 */
export type EmbeddingModelParams = OriginalEmbeddingsModelParams;

/**
 * Embedding model configuration.
 */
export interface EmbeddingModelConfig {
  /**
   * Model details for embedding generation.
   */
  model: EmbeddingModelDetails;
}

/**
 * Embedding module configuration.
 */
export interface EmbeddingModuleConfig {
  /**
   * Embeddings model configuration.
   */
  embeddings: EmbeddingModelConfig;

  /**
   * Masking module configuration.
   */
  masking?: MaskingModule;
}

/**
 * Embedding data with vector and index information.
 */
export interface EmbeddingData {
  /**
   * The object type, which is always "embedding".
   */
  object: 'embedding';
  /**
   * The embedding vector, either as a number array or base64-encoded string.
   */
  embedding: number[] | string;
  /**
   * The index of the embedding in the list of embeddings.
   */
  index: number;
}
