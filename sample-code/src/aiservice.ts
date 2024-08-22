import {
  OpenAiClient,
  OpenAiModels,
  OpenAiChatAssistantMessage
} from '@sap-ai-sdk/gen-ai-hub';

const openAiClient = new OpenAiClient();

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export async function chatCompletion(): Promise<string> {
  const response = await openAiClient.chatCompletion(
    OpenAiModels.GPT_35_TURBO,
    {
      messages: [{ role: 'user', content: 'What is the capital of France?' }]
    }
  );
  const assistantMessage = response.choices[0]
    .message as OpenAiChatAssistantMessage;
  return assistantMessage.content!;
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns An embedding vector.
 */
export async function computeEmbedding(): Promise<number[]> {
  const response = await openAiClient.embeddings(OpenAiModels.ADA_002, {
    input: 'Hello, world!'
  });
  return response.data[0].embedding;
}
