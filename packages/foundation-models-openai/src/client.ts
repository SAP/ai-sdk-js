import { AzureOpenAI } from 'openai';
import { Chat } from 'openai/resources/chat/chat';
import { Completions } from 'openai/resources/chat/completions/completions';
import { Embeddings } from 'openai/resources/embeddings';
import type { OpenAI } from 'openai';
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionCreateParamsBase,
  ParsedChatCompletion
} from 'openai/resources/chat/completions/completions';
import type { ExtractParsedContentFromParams } from 'openai/lib/parser';
import type { EmbeddingCreateParams, CreateEmbeddingResponse } from 'openai/resources/embeddings';
import type { Stream } from 'openai/core/streaming';
import type { APIPromise } from 'openai/core/api-promise';
import { createOpenAIConfig } from './config.js';
import type { SapAzureOpenAIOptions } from './types.js';

type RequestOptions = Parameters<Completions['create']>[1];
type WithoutModel<T> = Omit<T, 'model'>;

class SapCompletions extends Completions {
  readonly #defaultModel: string | undefined;

  constructor(client: OpenAI, defaultModel?: string) {
    super(client);
    this.#defaultModel = defaultModel;
  }

  create(
    body: WithoutModel<ChatCompletionCreateParamsNonStreaming>,
    options?: RequestOptions
  ): APIPromise<ChatCompletion>;
  create(
    body: WithoutModel<ChatCompletionCreateParamsStreaming>,
    options?: RequestOptions
  ): APIPromise<Stream<ChatCompletionChunk>>;
  create(
    body: WithoutModel<ChatCompletionCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<ChatCompletion | Stream<ChatCompletionChunk>>;
  create(
    body: WithoutModel<ChatCompletionCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<ChatCompletion | Stream<ChatCompletionChunk>> {
    return super.create(
      { model: this.#defaultModel ?? '', ...body } as ChatCompletionCreateParamsBase,
      options
    );
  }

  override parse<
    Params extends WithoutModel<ChatCompletionCreateParamsNonStreaming>,
    ParsedT = ExtractParsedContentFromParams<Params & { model: string }>
  >(
    body: Params,
    options?: RequestOptions
  ): APIPromise<ParsedChatCompletion<ParsedT>> {
    return super.parse(
      { model: this.#defaultModel ?? '', ...body } as ChatCompletionCreateParamsNonStreaming,
      options
    ) as APIPromise<ParsedChatCompletion<ParsedT>>;
  }
}

class SapChat extends Chat {
  override completions: SapCompletions;

  constructor(client: OpenAI, defaultModel?: string) {
    super(client);
    this.completions = new SapCompletions(client, defaultModel);
  }
}

class SapEmbeddings extends Embeddings {
  readonly #defaultModel: string | undefined;

  constructor(client: OpenAI, defaultModel?: string) {
    super(client);
    this.#defaultModel = defaultModel;
  }

  override create(
    body: WithoutModel<EmbeddingCreateParams>,
    options?: RequestOptions
  ): APIPromise<CreateEmbeddingResponse> {
    return super.create(
      { model: this.#defaultModel ?? '', ...body } as EmbeddingCreateParams,
      options
    );
  }
}

/**
 * A pre-configured `AzureOpenAI` client for SAP AI Core.
 * Handles deployment resolution, authentication, and SAP-specific headers automatically.
 *
 * The `model` parameter is removed from `chat.completions.create()` and `embeddings.create()`
 * signatures — it is pre-filled from the `modelDeployment` option passed at construction.
 *
 * Use {@link createAzureOpenAIClient} to create an instance.
 */
export class SapAzureOpenAI extends AzureOpenAI {
  override chat: SapChat;
  override embeddings: SapEmbeddings;

  /** @internal — use {@link createAzureOpenAIClient} instead */
  constructor(
    config: ConstructorParameters<typeof AzureOpenAI>[0],
    defaultModel?: string
  ) {
    super(config);
    this.chat = new SapChat(this, defaultModel);
    this.embeddings = new SapEmbeddings(this, defaultModel);
  }
}

/**
 * Creates a pre-configured {@link SapAzureOpenAI} client for SAP AI Core.
 * Resolves the deployment and sets up authentication automatically.
 * The `model` parameter is hidden from `chat.completions.create()` and `embeddings.create()`.
 *
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

  return new SapAzureOpenAI(config, defaultModel);
}
