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
  | 'gpt-35-turbo-16k'
>;

/**
 * Azure OpenAI models for embedding.
 */
export type AzureOpenAiEmbeddingModel = LiteralUnion<
  'text-embedding-ada-002' | 'text-embedding-3-small' | 'text-embedding-3-large'
>;
