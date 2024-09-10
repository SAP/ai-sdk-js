type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

/**
 * Azure OpenAI models for chat completion.
 */
export type AzureOpenAiChatModel = LiteralUnion<
  | 'gpt-4o-mini'
  | 'gpt-4o'
  | 'gpt-4'
  | 'gpt-4-32k'
  | 'gpt-35-turbo'
  | 'gpt-35-turbo-0125'
  | 'gpt-35-turbo-16k'
>;

/**
 * Azure OpenAI models for embedding.
 */
export type AzureOpenAiEmbeddingModel = LiteralUnion<
  'text-embedding-ada-002' | 'text-embedding-3-small' | 'text-embedding-3-large'
>;

/**
 * GCP Vertex AI models for chat completion.
 */
export type GcpVertexAiChatModel = LiteralUnion<
  'gemini-1.0-pro' | 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'chat-bison'
>;

/**
 * AWS Bedrock models for chat completion.
 */
export type AwsBedrockChatModel = LiteralUnion<
  | 'amazon--titan-text-express'
  | 'amazon--titan-text-lite'
  | 'anthropic--claude-3-haiku'
  | 'anthropic--claude-3-opus'
  | 'anthropic--claude-3-sonnet'
  | 'anthropic--claude-3.5-sonnet'
>;

/**
 * All available models for chat completion.
 */
export type ChatModel = LiteralUnion<
  | AzureOpenAiChatModel
  | GcpVertexAiChatModel
  | AwsBedrockChatModel
>;

/**
 * All available models for embeddings.
 */
export type EmbeddingModel = LiteralUnion<
  | AzureOpenAiEmbeddingModel
>;
