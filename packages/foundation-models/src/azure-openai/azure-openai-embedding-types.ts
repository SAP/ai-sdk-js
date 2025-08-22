/**
 * Azure OpenAI embedding input parameters.
 */
export type AzureOpenAiEmbeddingParameters = {
  /**
   * Input text to get embeddings for, encoded as a string. To get embeddings for multiple inputs in a single request, pass an array of strings. Each input must not exceed 2048 tokens in length.
   * Unless you are embedding code, we suggest replacing newlines (\n) in your input with a single space, as we have observed inferior results when newlines are present.
   */
  input: string | string[];
  /**
   * A unique identifier representing your end-user, which can help monitoring and detecting abuse.
   */
  user?: string;
  /**
   * Input type of embedding search to use.
   * @example "query"
   */
  input_type?: string;
  /**
   * The format to return the embeddings in. Can be either `float` or `base64`. Defaults to `float`.
   * @example "float"
   */
  encoding_format?: string | null;
  /**
   * The number of dimensions the resulting output embeddings should have. Only supported in `text-embedding-3` and later models.
   * @example 1
   */
  dimensions?: number | null;
} & Record<string, any>;

/**
 * Azure OpenAI embedding output.
 * @internal
 */
export type AzureOpenAiEmbeddingOutput = {
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
  } & Record<string, any>[];
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
  } & Record<string, any>;
} & Record<string, any>;
