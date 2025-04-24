type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

/**
 * Azure OpenAI models for chat completion.
 */
export type AzureOpenAiChatModel = LiteralUnion<
  'gpt-4o-mini' | 'gpt-4o' | 'gpt-4' | 'o1' | 'o3-mini'
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
  'gemini-1.0-pro' | 'gemini-1.5-pro' | 'gemini-1.5-flash'
>;

/**
 * AWS Bedrock models for chat completion.
 */
export type AwsBedrockChatModel = LiteralUnion<
  | 'anthropic--claude-3-haiku'
  | 'anthropic--claude-3-opus'
  | 'anthropic--claude-3-sonnet'
  | 'anthropic--claude-3.5-sonnet'
  | 'amazon--titan-text-express'
  | 'amazon--titan-text-lite'
  | 'amazon--nova-pro'
  | 'amazon--nova-lite'
  | 'amazon--nova-micro'
>;

/**
 * AI Core open source models for chat completion.
 */
export type AiCoreOpenSourceChatModel = LiteralUnion<
  | 'mistralai--mixtral-8x7b-instruct-v01'
  | 'mistralai--mistral-large-instruct'
  | 'meta--llama3.1-70b-instruct'
  | 'ibm--granite-13b-chat'
  | 'alephalpha-pharia-1-7b-control'
>;
