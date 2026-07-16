import type { AzureOpenAiRealtimeModel } from '@sap-ai-sdk/core';
import type { SapOpenAiBaseOptions } from '../types.js';

/**
 * Options for creating a pre-configured Realtime API client for SAP AI Core.
 */
export type SapOpenAiRealtimeOptions =
  SapOpenAiBaseOptions<AzureOpenAiRealtimeModel>;

/**
 * Options or a model name string for creating a pre-configured Realtime API client.
 * Passing a string is shorthand for `{ deployment: modelName }`.
 */
export type SapOpenAiRealtimeInput =
  SapOpenAiRealtimeOptions | AzureOpenAiRealtimeModel;

/** @internal */
export interface SapOpenAiRealtimeContext {
  /** The resolved deployment URL (without the `/v1/realtime` suffix). */
  url: string;
  /** Returns a fresh bearer token for the AI Core destination on each invocation. */
  tokenProvider: () => Promise<string>;
  /** The resolved AI resource group. */
  resourceGroup: string;
  /** Additional value appended to the `AI-Client-Type` header. */
  clientType?: string;
}
