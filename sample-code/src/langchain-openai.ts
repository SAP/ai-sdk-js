import { HumanMessage } from '@langchain/core/messages';
import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient
} from '@sap-ai-sdk/langchain';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export async function generate(): Promise<string> {
  const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });
  const response = await client.generate([
    [new HumanMessage('What is the capital of France?')]
  ]);
  return response.generations[0][0].text;
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns An embedding vector.
 */
export async function embedQuery(): Promise<number[]> {
  const client = new AzureOpenAiEmbeddingClient({
    modelName: 'text-embedding-ada-002'
  });
  return client.embedQuery('Hello, world!');
}
