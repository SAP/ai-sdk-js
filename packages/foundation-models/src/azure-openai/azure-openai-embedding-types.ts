/**
 * Azure OpenAI embedding input parameters.
 */
export interface AzureOpenAiEmbeddingParameters {
  /**
   * Input text to get embeddings for, encoded as a string. The number of input tokens varies depending on what model you are using. Unless you're embedding code, we suggest replacing newlines (\n) in your input with a single space, as we have observed inferior results when newlines are present.
   */
  input: string[] | string;
  /**
   * A unique identifier representing for your end-user. This will help Azure OpenAI monitor and detect abuse. Do not pass PII identifiers instead use pseudoanonymized values such as GUIDs.
   */
  user?: string;
}

/**
 * Azure OpenAI embedding output.
 */
export interface AzureOpenAiEmbeddingOutput {
  /**
   * List object.
   */
  object: 'list';
  /**
   * Model used for embedding.
   */
  model: string;
  /**
   * Array of result candidates.
   */
  data: {
    /**
     * Embedding object.
     */
    object: 'embedding';
    /**
     * Array of size `1536` (Azure OpenAI's embedding size) containing embedding vector.
     */
    embedding: number[];
    /**
     * Index of choice.
     */
    index: number;
  }[];
  /**
   * Token Usage.
   */
  usage: {
    /**
     * Tokens consumed for input prompt tokens.
     */
    prompt_tokens: number;
    /**
     * Total tokens consumed.
     */
    total_tokens: number;
  };
}
