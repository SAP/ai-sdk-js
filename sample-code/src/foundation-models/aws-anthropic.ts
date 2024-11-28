import { createLogger } from '@sap-cloud-sdk/util';
import {
  AwsAnthropicChatClient,
  AwsAnthropicEmbeddingClient
} from '@sap-ai-sdk/foundation-models';
import type {
  AwsAnthropicChatCompletionResponse,
  AwsAnthropicEmbeddingResponse
} from '@sap-ai-sdk/foundation-models';

const logger = createLogger({
  package: 'sample-code',
  messageContext: 'foundation-models-aws-anthropic'
});

/**
 * Ask AWS Anthropic model about the capital of France.
 * @returns The response from AWS Anthropic containing the response content.
 */
export async function chatCompletionAnthropic(): Promise<AwsAnthropicChatCompletionResponse> {
  const response = await new AwsAnthropicChatClient(
    'anthropic--claude-3.5-sonnet'
  ).run({
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'What is the capital of France?' }],
    anthropic_version: 'bedrock-2023-05-31'
  });

  // Use getContent() to access the content responded by LLM.
  logger.info(response.getContent());

  return response;
}

/**
 * Embed 'Hello, world!' using the Amazon Titan Embed model.
 * @returns The response from Azure OpenAI containing the embedding vector.
 */
export async function computeEmbeddingAnthropic(): Promise<AwsAnthropicEmbeddingResponse> {
  const response = await new AwsAnthropicEmbeddingClient(
    'amazon--titan-embed-text'
  ).run({
    inputText: 'Hello, world!'
  });

  // Use getEmbedding to access the embedding vector
  logger.info(response.getEmbedding());

  return response;
}
