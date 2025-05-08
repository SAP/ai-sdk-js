/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceThreads } from './agent-controller-service-threads.js';
import type { AgentControllerServiceTraces } from './agent-controller-service-traces.js';
import type { Count } from './count.js';
import type { AgentControllerServiceTokens } from './agent-controller-service-tokens.js';
import type { AgentControllerServiceInputs } from './agent-controller-service-inputs.js';
/**
 * Representation of the 'AgentControllerServiceMessages' schema.
 */
export type AgentControllerServiceMessages = {
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  ID?: string;
  /**
   * @example "2017-04-13T15:51:04.0000000Z"
   * Format: "date-time".
   */
  createdAt?: string | null;
  /**
   * @example "2017-04-13T15:51:04.0000000Z"
   * Format: "date-time".
   */
  modifiedAt?: string | null;
  thread?: AgentControllerServiceThreads;
  traces?: AgentControllerServiceTraces[];
  'traces@count'?: Count;
  tokens?: AgentControllerServiceTokens[];
  'tokens@count'?: Count;
  previous?: AgentControllerServiceMessages | null;
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  previous_ID?: string | null;
  /**
   * Default: "message".
   */
  type?: string;
  canceled?: boolean | null;
  sender?: string;
  content?: string;
  outputFormat?: string | null;
  outputFormatOptions?: string | null;
  scratchpad?: string | null;
  inputs?: AgentControllerServiceInputs[];
  'inputs@count'?: Count;
  group?: AgentControllerServiceMessages;
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  group_ID?: string;
  guardrailed?: boolean;
} & Record<string, any>;
