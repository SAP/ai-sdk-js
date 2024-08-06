// eslint-disable-next-line import/namespace
import { OpenAiClient } from '@sap-ai-sdk/gen-ai-hub';
import { OpenAiModels } from '@sap-ai-sdk/gen-ai-hub/dist/client/index.js';

const openAiClient = new OpenAiClient();

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export function chatCompletion(): Promise<any> {
  return openAiClient.chatCompletion(
    OpenAiModels.GPT_35_TURBO, 
    {
      messages: [{ role: 'user', content: 'What is the capital of France?' }]
    })
    .then(response => response.choices[0].message.content);
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns An embedding vector.
 */
export function computeEmbedding(): Promise<number[]> {
  return openAiClient.embeddings(
    OpenAiModels.ADA_002, 
    {
      input: 'Hello, world!'
    })
    .then(response => response.data[0].embedding);
}
