/**
 * AWS Anthropic embedding input parameters.
 */
export interface AwsAnthropicEmbeddingParameters {
  /**
   * Input text to get embeddings for, encoded as a string. The number of input tokens varies depending on what model you are using.
   */
  inputText: string[] | string;
}

/**
 * AWS Anthropic embedding output.
 */
export interface AwsAnthropicEmbeddingOutput {
  /**
   * Array of size `1536` (AWS Anthropic's embedding size) containing embedding vector.
   */
  embedding: number[];
  /**
   * Total Tokens Consumed.
   */
  inputTextTotalCount: number;
}
