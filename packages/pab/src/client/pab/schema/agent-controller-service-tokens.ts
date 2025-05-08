/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceMessages } from './agent-controller-service-messages.js';
import type { AgentControllerServiceTraces } from './agent-controller-service-traces.js';
/**
 * Representation of the 'AgentControllerServiceTokens' schema.
 */
export type AgentControllerServiceTokens = {
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
  message?: AgentControllerServiceMessages;
  trace?: AgentControllerServiceTraces;
  modelName?: string;
  /**
   * Format: "int32".
   */
  inputTokens?: number;
  /**
   * Format: "int32".
   */
  outputTokens?: number;
  /**
   * Default: "0.0".
   */
  inputTokensCost?: number | string;
  /**
   * Default: "0.0".
   */
  outputTokensCost?: number | string;
} & Record<string, any>;
