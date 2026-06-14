import { AzureOpenAI } from 'openai';
import { createOpenAiConfig } from './config.js';
import { SapChat } from './chat.js';
import { SapEmbeddings } from './embeddings.js';
import { SapResponses } from './responses.js';
import type { SapOpenAiInput } from './types.js';

/**
 * A pre-configured client for SAP AI Core backed by the official `openai` package.
 * Handles deployment resolution, authentication, and SAP-specific headers automatically.
 *
 * The `model` parameter is removed from `chat.completions.create()`, `chat.completions.parse()`,
 * `embeddings.create()`, and `responses.create()` signatures — SAP AI Core routes requests via
 * the deployment URL, so the `model` field in the request body is not used.
 *
 * Only the endpoints supported by SAP AI Core are exposed (`chat`, `embeddings`, `responses`).
 * Use {@link SapOpenAi.createClient} to create an instance.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapOpenAi {
  /**
   * Creates a pre-configured {@link SapOpenAi} client for SAP AI Core.
   * Resolves the deployment and sets up authentication automatically.
   * The `model` parameter is omitted from `chat.completions.create()`, `chat.completions.parse()`,
   * `embeddings.create()`, and `responses.create()` — SAP AI Core routes requests via the deployment URL.
   * @param options - Options including model deployment, destination, API version, and client type. A plain model name string is accepted as shorthand for `{ deployment: modelName }`.
   * @returns A promise that resolves to a ready-to-use {@link SapOpenAi} instance.
   * @example
   * ```ts
   * import { SapOpenAi } from '@sap-ai-sdk/openai';
   *
   * const client = await SapOpenAi.createClient('gpt-4.1');
   * await client.chat.completions.create({
   *   messages: [{ role: 'user', content: 'Hello!' }]
   * });
   * ```
   */
  static async createClient(options: SapOpenAiInput): Promise<SapOpenAi> {
    const config = await createOpenAiConfig(options);
    return new SapOpenAi(new AzureOpenAI(config));
  }

  readonly chat: SapChat;
  readonly embeddings: SapEmbeddings;
  readonly responses: SapResponses;

  /** @internal — use {@link SapOpenAi.createClient} instead */
  constructor(client: AzureOpenAI) {
    this.chat = new SapChat(client);
    this.embeddings = new SapEmbeddings(client);
    this.responses = new SapResponses(client);
  }
}
