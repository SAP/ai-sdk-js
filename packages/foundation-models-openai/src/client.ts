import { AzureOpenAI } from 'openai';
import { createOpenAIConfig } from './config.js';
import { SapChat } from './chat.js';
import { SapEmbeddings } from './embeddings.js';
import { SapResponses } from './responses.js';
import type { SapAzureOpenAIOptions } from './types.js';

/**
 * A pre-configured client for SAP AI Core backed by the official `openai` package.
 * Handles deployment resolution, authentication, and SAP-specific headers automatically.
 *
 * The `model` parameter is removed from `chat.completions.create()`, `chat.completions.parse()`,
 * `embeddings.create()`, and `responses.create()` signatures — it is pre-filled from the
 * `modelDeployment` option passed at construction.
 *
 * Only the endpoints supported by SAP AI Core are exposed (`chat`, `embeddings`, `responses`).
 * Use {@link createAzureOpenAIClient} to create an instance.
 */
export class SapAzureOpenAI {
  readonly chat: SapChat;
  readonly embeddings: SapEmbeddings;
  readonly responses: SapResponses;

  /** @internal — use {@link createAzureOpenAIClient} instead */
  constructor(
    chat: SapChat,
    embeddings: SapEmbeddings,
    responses: SapResponses
  ) {
    this.chat = chat;
    this.embeddings = embeddings;
    this.responses = responses;
  }
}

/**
 * Creates a pre-configured {@link SapAzureOpenAI} client for SAP AI Core.
 * Resolves the deployment and sets up authentication automatically.
 * The `model` parameter is hidden from `chat.completions.create()`, `chat.completions.parse()`,
 * `embeddings.create()`, and `responses.create()`.
 * @param options - Options including model deployment, destination, API version, and client type.
 * @returns A promise that resolves to a ready-to-use {@link SapAzureOpenAI} instance.
 * @example
 * ```ts
 * import { createAzureOpenAIClient } from '@sap-ai-sdk/foundation-models-openai';
 *
 * const client = await createAzureOpenAIClient({ modelDeployment: 'gpt-4.1' });
 * await client.chat.completions.create({
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */
export async function createAzureOpenAIClient(
  options: SapAzureOpenAIOptions
): Promise<SapAzureOpenAI> {
  const config = await createOpenAIConfig(options);

  const defaultModel =
    typeof options.modelDeployment === 'string'
      ? options.modelDeployment
      : 'modelName' in options.modelDeployment
        ? options.modelDeployment.modelName
        : undefined;

  const azureOpenAI = new AzureOpenAI(config);

  return new SapAzureOpenAI(
    new SapChat(azureOpenAI, defaultModel),
    new SapEmbeddings(azureOpenAI, defaultModel),
    new SapResponses(azureOpenAI, defaultModel)
  );
}
