import type { AzureOpenAiRealtimeModel } from '@sap-ai-sdk/core';

import type { SapOpenAiBaseOptions } from '../types.ts';
import type * as WS from 'ws';

/**
 * Options for creating a pre-configured Realtime API client for SAP AI Core.
 */
export type SapOpenAiRealtimeOptions =
  SapOpenAiBaseOptions<AzureOpenAiRealtimeModel> & {
    /** Options passed to `ws.WebSocket` constructor. */
    wsOptions?: WS.ClientOptions;
  };

/**
 * Options or a model name string for creating a pre-configured Realtime API client.
 * Passing a string is shorthand for `{ deployment: modelName }`.
 */
export type SapOpenAiRealtimeInput =
  | SapOpenAiRealtimeOptions
  | AzureOpenAiRealtimeModel;
