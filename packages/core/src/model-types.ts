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
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-lite'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-pro'
>;

/**
 * AWS Bedrock models for chat completion.
 */
export type AwsBedrockChatModel = LiteralUnion<
  | 'anthropic--claude-3-haiku'
  | 'anthropic--claude-3-opus'
  | 'anthropic--claude-3-sonnet'
  | 'anthropic--claude-3.5-sonnet'
  | 'anthropic--claude-3.7-sonnet'
  | 'anthropic--claude-4-opus'
  | 'anthropic--claude-4-sonnet'
  | 'amazon--titan-text-express'
  | 'amazon--titan-text-lite'
  | 'amazon--nova-pro'
  | 'amazon--nova-lite'
  | 'amazon--nova-micro'
  | 'amazon--nova-premier'
>;

/**
 * AI Core open source models for chat completion.
 */
export type AiCoreOpenSourceChatModel = LiteralUnion<
  | 'mistralai--mistral-large-instruct'
  | 'mistralai--mistral-small-instruct'
  | 'meta--llama3.1-70b-instruct'
  | 'ibm--granite-13b-chat'
  | 'alephalpha-pharia-1-7b-control'
  | 'deepseek-ai--deepseek-r1'
>;
