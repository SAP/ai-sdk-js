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
 * Unsupported endpoints inherited from `AzureOpenAI` are marked `never`.
 * Use {@link createAzureOpenAIClient} to create an instance.
 */
export class SapAzureOpenAI extends AzureOpenAI {
  // Supported endpoints with SAP-specific wrappers.
  override chat: SapChat;
  override embeddings: SapEmbeddings;
  override responses: SapResponses;

  // Unsupported endpoints — SAP AI Core does not support these operations.
  override completions: never = null as never;
  override files: never = null as never;
  override images: never = null as never;
  override audio: never = null as never;
  override moderations: never = null as never;
  override models: never = null as never;
  override fineTuning: never = null as never;
  override graders: never = null as never;
  override vectorStores: never = null as never;
  override webhooks: never = null as never;
  override beta: never = null as never;
  override batches: never = null as never;
  override uploads: never = null as never;
  override admin: never = null as never;
  override realtime: never = null as never;
  override conversations: never = null as never;
  override evals: never = null as never;
  override containers: never = null as never;
  override skills: never = null as never;
  override videos: never = null as never;

  /** @internal — use {@link createAzureOpenAIClient} instead */
  constructor(
    config: ConstructorParameters<typeof AzureOpenAI>[0],
    chat: SapChat,
    embeddings: SapEmbeddings,
    responses: SapResponses
  ) {
    super(config);
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

  return new SapAzureOpenAI(
    config,
    new SapChat(new AzureOpenAI(config), defaultModel),
    new SapEmbeddings(new AzureOpenAI(config), defaultModel),
    new SapResponses(new AzureOpenAI(config), defaultModel)
  );
}
