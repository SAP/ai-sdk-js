import { HumanMessage } from '@langchain/core/messages';
import {
    OpenAiChatClient,
    OpenAiEmbeddingClient
} from '@sap-ai-sdk/langchain';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export async function generate(): Promise<string> {
  const client = new OpenAiChatClient({ modelName: 'gpt-35-turbo' });
  const response = await client.generate([[new HumanMessage('What is the capital of France?')]]);
  return response.generations[0][0].text;
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns An embedding vector.
 */
export async function embedQuery(): Promise<number[]> {
  const client = new OpenAiEmbeddingClient({ modelName: 'text-embedding-ada-002' });
  const response = await client.embedQuery('Hello, world!');

  return response;
}
