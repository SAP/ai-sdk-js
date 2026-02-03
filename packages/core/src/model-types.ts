type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

/**
 * Azure OpenAI models for chat completion.
 */
export type AzureOpenAiChatModel = LiteralUnion<
  | 'gpt-4o-mini'
  | 'gpt-4o'
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'gpt-4.1-nano'
  | 'o1'
  | 'o3'
  | 'o3-mini'
  | 'o4-mini'
  | 'gpt-5'
  | 'gpt-5-mini'
  | 'gpt-5-nano'
>;

/**
 * Azure OpenAI models for embedding.
 */
export type AzureOpenAiEmbeddingModel = LiteralUnion<
  'text-embedding-3-small' | 'text-embedding-3-large'
>;

/**
 * GCP Vertex AI models for chat completion.
 */
export type GcpVertexAiChatModel = LiteralUnion<
  'gemini-2.5-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.5-pro'
>;

/**
 * AWS Bedrock models for chat completion.
 */
export type AwsBedrockChatModel = LiteralUnion<
  | 'anthropic--claude-3-haiku'
  | 'anthropic--claude-4.5-haiku'
  | 'anthropic--claude-3-opus'
  | 'anthropic--claude-3-sonnet'
  | 'anthropic--claude-3.5-sonnet'
  | 'anthropic--claude-3.7-sonnet'
  | 'anthropic--claude-4-opus'
  | 'anthropic--claude-4-sonnet'
  | 'anthropic--claude-4.5-sonnet'
  | 'amazon--nova-pro'
  | 'amazon--nova-lite'
  | 'amazon--nova-micro'
  | 'amazon--nova-premier'
>;

/**
 * AWS Bedrock models for embedding.
 */
export type AwsBedrockEmbeddingModel = LiteralUnion<'amazon--titan-embed-text'>;

/**
 * Perplexity models for chat completion.
 */
export type PerplexityChatModel = LiteralUnion<'sonar' | 'sonar-pro'>;

/**
 * AI Core open source models for chat completion.
 */
export type AiCoreOpenSourceChatModel = LiteralUnion<
  | 'cohere--command-a-reasoning'
  | 'mistralai--mistral-large-instruct'
  | 'mistralai--mistral-medium-instruct'
  | 'mistralai--mistral-small-instruct'
  | 'sap-abap-1'
>;

/**
 * AI Core sap managed model for embedding.
 */
export type AiCoreOpenSourceEmbeddingModel =
  LiteralUnion<'nvidia--llama-3.2-nv-embedqa-1b'>;

/**
 * SAP RPT models.
 */
export type SapRptModel = LiteralUnion<'sap-rpt-1-small' | 'sap-rpt-1-large'>;
