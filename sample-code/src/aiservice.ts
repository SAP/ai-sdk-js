import {
  OpenAiChatAssistantMessage,
  OpenAiClient
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export async function chatCompletion(): Promise<string> {
  const response = await new OpenAiClient('gpt-35-turbo').chatCompletion({
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });
  const assistantMessage = response.choices[0]
    .message as OpenAiChatAssistantMessage;
  return assistantMessage.content!;
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns An embedding vector.
 */
export async function computeEmbedding(): Promise<number[]> {
  const response = await new OpenAiClient('text-embedding-ada-002').embeddings({
    input: 'Hello, world!'
  });

  return response.data[0].embedding;
}
