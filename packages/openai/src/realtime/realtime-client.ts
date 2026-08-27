import { OpenAIRealtimeWS } from 'openai/realtime/ws';

import { SapAzureOpenAi } from '../azure-openai.ts';
import { createSapOpenAiContext } from '../config.ts';

import type { SapOpenAiContext } from '../types.ts';
import type { SapOpenAiRealtimeInput } from './types.ts';
import type * as WS from 'ws';

/**
 * A pre-configured OpenAI Realtime API (speech-to-speech) client for SAP AI Core.
 *
 * Only `gpt-realtime` is supported. Session configuration must use the GA `session.update` schema
 * (`output_modalities`, nested `audio`), not the preview schema.
 *
 * Use {@link SapOpenAiRealtimeWs.createClient} to create an instance.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapOpenAiRealtimeWs extends OpenAIRealtimeWS {
  static override readonly create: never = undefined as never;
  static override readonly azure: never = undefined as never;

  /**
   * @param context - The SAP OpenAI context.
   * @param options - The realtime input options.
   * @returns The WebSocket client options.
   */
  private static buildWsOptions(
    context: SapOpenAiContext,
    options: SapOpenAiRealtimeInput
  ): WS.ClientOptions {
    const { clientType, wsOptions: userWsOptions } =
      typeof options === 'object' ? options : {};
    return {
      ...userWsOptions,
      headers: {
        ...userWsOptions?.headers,
        'AI-Resource-Group': context.resourceGroup,
        'AI-Client-Type': ['AI SDK JavaScript', clientType]
          .filter(Boolean)
          .join(',')
      }
    };
  }

  /**
   * Creates a pre-configured {@link SapOpenAiRealtimeWs} client and opens the WebSocket connection to SAP AI Core.
   * Resolves the deployment, fetches a bearer token, and sets the SAP-specific headers automatically.
   * @param options - Options including model deployment, destination, and client type. A plain model name string is accepted as shorthand for `{ deployment: modelName }`.
   * @returns A promise that resolves to a connected {@link SapOpenAiRealtimeWs} instance.
   * @example
   * ```ts
   * import { SapOpenAiRealtimeWs } from '@sap-ai-sdk/openai/realtime';
   *
   * const client = await SapOpenAiRealtimeWs.createClient('gpt-realtime');
   * client.on('session.created', () => {
   *   client.send({
   *     type: 'session.update',
   *     session: { type: 'realtime', output_modalities: ['audio'] }
   *   });
   * });
   * ```
   */
  static async createClient(
    options: SapOpenAiRealtimeInput
  ): Promise<SapOpenAiRealtimeWs> {
    const context = await createSapOpenAiContext(options);

    const wsOptions = SapOpenAiRealtimeWs.buildWsOptions(context, options);
    const openAiClient = new SapAzureOpenAi(context);
    const resolvedApiKey = await openAiClient._callApiKey();

    return new SapOpenAiRealtimeWs(
      {
        model: 'gpt-realtime',
        options: wsOptions,
        __resolvedApiKey: resolvedApiKey,
        buildRealtimeURL: () => {
          const base = openAiClient.baseURL.replace(/\/$/, '');
          let url: URL;
          try {
            url = new URL(base + '/v1/realtime');
          } catch {
            throw new Error(
              `Invalid SAP AI Core deployment URL: "${openAiClient.baseURL}". Ensure the deployment is resolved correctly before opening a Realtime connection.`
            );
          }
          url.protocol = 'wss';
          if (openAiClient.apiVersion) {
            url.searchParams.set('api-version', openAiClient.apiVersion);
          }
          return url;
        }
      },
      openAiClient
    );
  }
}
