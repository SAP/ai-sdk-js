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
 * `embeddings.create()`, and `responses.create()` signatures — SAP AI Core routes requests via
 * the deployment URL, so the `model` field in the request body is not used.
 *
 * Only the endpoints supported by SAP AI Core are exposed (`chat`, `embeddings`, `responses`).
 * Use {@link SapAzureOpenAI.createClient} to create an instance.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapAzureOpenAI {
  /**
   * Creates a pre-configured {@link SapAzureOpenAI} client for SAP AI Core.
   * Resolves the deployment and sets up authentication automatically.
   * The `model` parameter is omitted from `chat.completions.create()`, `chat.completions.parse()`,
   * `embeddings.create()`, and `responses.create()` — SAP AI Core routes requests via the deployment URL.
   * @param options - Options including model deployment, destination, API version, and client type.
   * @returns A promise that resolves to a ready-to-use {@link SapAzureOpenAI} instance.
   * @example
   * ```ts
   * import { SapAzureOpenAI } from '@sap-ai-sdk/openai';
   *
   * const client = await SapAzureOpenAI.createClient({ modelDeployment: 'gpt-4.1' });
   * await client.chat.completions.create({
   *   messages: [{ role: 'user', content: 'Hello!' }]
   * });
   * ```
   */
  static async createClient(
    options: SapAzureOpenAIOptions
  ): Promise<SapAzureOpenAI> {
    const config = await createOpenAIConfig(options);
    return new SapAzureOpenAI(new AzureOpenAI(config));
  }

  readonly chat: SapChat;
  readonly embeddings: SapEmbeddings;
  readonly responses: SapResponses;

  /** @internal — use {@link SapAzureOpenAI.createClient} instead */
  constructor(client: AzureOpenAI) {
    this.chat = new SapChat(client);
    this.embeddings = new SapEmbeddings(client);
    this.responses = new SapResponses(client);
  }
}
