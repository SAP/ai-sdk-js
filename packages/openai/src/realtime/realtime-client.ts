import { OpenAIRealtimeWS } from 'openai/realtime/ws';

import { SapAzureOpenAi } from '../azure-openai.ts';
import { createSapOpenAiContext } from '../config.ts';

import type { SapOpenAiContext } from '../types.ts';
import type { SapOpenAiRealtimeInput } from './types.ts';
import type * as WS from 'ws';

/**
 * Rewrites a realtime WebSocket URL for SAP AI Core compatibility.
 *
 * Ensures the path ends in `/v1/realtime` and strips all query params except
 * `api-version` (unsupported params like `deployment=` are forwarded by ws-proxy to
 * Azure upstream and can cause connection failures).
 * @param url - The URL to rewrite in place.
 * @returns The rewritten URL.
 * @throws If the URL path does not end in `/realtime`.
 * @internal
 */
export function rewriteRealtimeUrl(url: URL): URL {
  if (!url.pathname.endsWith('/realtime')) {
    throw new Error(
      `Unexpected realtime URL path: "${url.pathname}". Expected path ending in "/realtime".`
    );
  }
  const apiVersion = url.searchParams.get('api-version');
  url.search = '';
  // TODO: Other searchParams may have to be supported in future version as supports expands,
  // e.g. `call_id` for joining an existing session.
  // For now, only forward the well-known `api-version` parameter.
  if (apiVersion) {
    url.searchParams.set('api-version', apiVersion);
  }
  if (!url.pathname.endsWith('/v1/realtime')) {
    url.pathname = url.pathname.replace(/\/realtime$/, '/v1/realtime');
  }
  return url;
}

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

  declare private _url: URL;

  static {
    // Replace the inherited data property `url` with an accessor so we can
    // intercept the value set by the parent constructor and rewrite the path.
    // TODO: Move to `buildRealtimeURL()` callback once openai/openai-node#2308 is released.
    Object.defineProperty(this.prototype, 'url', {
      get(this: SapOpenAiRealtimeWs) {
        return this._url;
      },
      set(this: SapOpenAiRealtimeWs, url: URL) {
        this._url = rewriteRealtimeUrl(url);
      }
    });
  }

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
        __resolvedApiKey: resolvedApiKey
      },
      openAiClient
    );
  }
}
