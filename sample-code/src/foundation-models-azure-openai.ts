import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient
} from '@sap-ai-sdk/foundation-models';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export async function chatCompletion(): Promise<string> {
  const response = await new AzureOpenAiChatClient('gpt-35-turbo').run({
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });
  return response.getContent()!;
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns An embedding vector.
 */
export async function computeEmbedding(): Promise<number[]> {
  const response = await new AzureOpenAiEmbeddingClient(
    'text-embedding-ada-002'
  ).run({
    input: 'Hello, world!'
  });

  return response.getEmbedding()!;
}
