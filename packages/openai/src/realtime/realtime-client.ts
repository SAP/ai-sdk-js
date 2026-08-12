import { OpenAIRealtimeWS } from 'openai/realtime/ws';
import type * as WS from 'ws';

import { createSapOpenAiContext } from '../config.ts';
import { SapAzureOpenAi } from '../azure-openai.ts';
import type { SapOpenAiRealtimeInput } from './types.ts';

/**
 * A pre-configured OpenAI Realtime API (speech-to-speech) client for SAP AI Core.
 *
 * Only `gpt-realtime` is supported. Session configuration must use the GA `session.update` schema
 * (`output_modalities`, nested `audio`), not the preview schema.
 *
 * Use {@link SapOpenAiRealtime.createClient} to create an instance.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapOpenAiRealtime extends OpenAIRealtimeWS {
  static override readonly create: never = undefined as never;
  static override readonly azure: never = undefined as never;

  declare private _url: URL;

  static {
    Object.defineProperty(this.prototype, 'url', {
      get(this: SapOpenAiRealtime) {
        return this.getUrl();
      },
      set(this: SapOpenAiRealtime, url: URL) {
        this.setUrl(url);
      }
    });
  }

  private getUrl(): URL {
    return this._url;
  }

  private setUrl(url: URL): void {
    url.search = '';
    url.pathname = url.pathname.replace(/\/realtime$/, '/v1/realtime');
    this._url = url;
  }

  /**
   * Creates a pre-configured {@link SapOpenAiRealtime} client and opens the WebSocket connection to SAP AI Core.
   * Resolves the deployment, fetches a bearer token, and sets the SAP-specific headers automatically.
   * @param options - Options including model deployment, destination, and client type. A plain model name string is accepted as shorthand for `{ deployment: modelName }`.
   * @returns A promise that resolves to a connected {@link SapOpenAiRealtime} instance.
   * @example
   * ```ts
   * import { SapOpenAiRealtime } from '@sap-ai-sdk/openai/realtime';
   *
   * const client = await SapOpenAiRealtime.createClient('gpt-realtime');
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
  ): Promise<SapOpenAiRealtime> {
    const userWsOptions =
      typeof options === 'object' && 'wsOptions' in options
        ? options.wsOptions
        : undefined;
    const clientType =
      typeof options === 'object' ? options.clientType : undefined;
    const context = await createSapOpenAiContext(options);
    const wsOptions: WS.ClientOptions = {
      ...userWsOptions,
      headers: {
        ...userWsOptions?.headers,
        'AI-Resource-Group': context.resourceGroup,
        'AI-Client-Type': ['AI SDK JavaScript', clientType]
          .filter(Boolean)
          .join(',')
      }
    };
    const openAiClient = new SapAzureOpenAi(context);
    const resolvedApiKey = await openAiClient._callApiKey();

    return new SapOpenAiRealtime(
      {
        model: 'gpt-realtime',
        options: wsOptions,
        __resolvedApiKey: resolvedApiKey
      },
      openAiClient
    );
  }
}
