import { OpenAIRealtimeEmitter } from 'openai/realtime/internal-base.js';
import WebSocket from 'ws';
import { createRealtimeContext } from './realtime-config.js';
import type {
  RealtimeClientEvent,
  RealtimeServerEvent
} from 'openai/resources/realtime/realtime';
import type { SapOpenAiRealtimeInput } from './types.js';

/**
 * A pre-configured OpenAI Realtime API (speech-to-speech) client for SAP AI Core.
 *
 * Only `gpt-realtime` is supported. Session configuration must use the GA `session.update` schema
 * (`output_modalities`, nested `audio`), not the preview schema.
 *
 * Use {@link SapOpenAiRealtime.createClient} to create an instance.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapOpenAiRealtime extends OpenAIRealtimeEmitter {
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
    const { url, tokenProvider, resourceGroup, clientType } =
      await createRealtimeContext(options);
    const token = await tokenProvider();
    return new SapOpenAiRealtime(url, token, resourceGroup, clientType);
  }

  /** The resolved WebSocket URL, including the `/v1/realtime` suffix. */
  readonly url: URL;

  private readonly socket: WebSocket;

  /** @internal — use {@link SapOpenAiRealtime.createClient} instead */
  private constructor(
    deploymentUrl: string,
    token: string,
    resourceGroup: string,
    clientType?: string
  ) {
    super();

    this.url = new URL(`${deploymentUrl}/v1/realtime`);
    this.url.protocol = 'wss';

    this.socket = new WebSocket(this.url.toString(), undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'AI-Resource-Group': resourceGroup,
        'AI-Client-Type': ['AI SDK JavaScript', clientType]
          .filter(Boolean)
          .join(',')
      }
      // ws.WebSocket doesn't satisfy the browser-shim WebSocket type from the openai realtime shims.
    }) as WebSocket;

    this.socket.on('message', (data: WebSocket.RawData) => {
      let event: RealtimeServerEvent;
      try {
        event = JSON.parse(data.toString());
      } catch (err) {
        this._onError(null, 'could not parse websocket event', err);
        return;
      }
      this._emit('event', event);
      if (event.type === 'error') {
        this._onError(event);
      } else {
        // @ts-expect-error TS isn't smart enough to get the relationship right here
        this._emit(event.type, event);
      }
    });

    this.socket.on('error', err => {
      this._onError(null, err.message, err);
    });
  }

  /**
   * Sends a client event to the Realtime API.
   * @param event - The client event to send.
   */
  send(event: RealtimeClientEvent): void {
    try {
      this.socket.send(JSON.stringify(event));
    } catch (err) {
      this._onError(null, 'could not send data', err);
    }
  }

  /**
   * Closes the WebSocket connection.
   * @param props - Optional close options.
   * @param props.code - The WebSocket close code. Defaults to `1000`.
   * @param props.reason - The close reason. Defaults to `'OK'`.
   */
  close(props?: { code?: number; reason?: string }): void {
    try {
      this.socket.close(props?.code ?? 1000, props?.reason ?? 'OK');
    } catch (err) {
      this._onError(null, 'could not close the connection', err);
    }
  }
}
