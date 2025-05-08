/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceTracesCreate } from './agent-controller-service-traces-create.js';
import type { AgentControllerServiceTokensCreate } from './agent-controller-service-tokens-create.js';
import type { AgentControllerServiceInputsCreate } from './agent-controller-service-inputs-create.js';
/**
 * Representation of the 'AgentControllerServiceMessagesUpdate' schema.
 */
export type AgentControllerServiceMessagesUpdate = {
  traces?: AgentControllerServiceTracesCreate[];
  tokens?: AgentControllerServiceTokensCreate[];
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  previous_ID?: string | null;
  canceled?: boolean | null;
  sender?: string;
  content?: string;
  outputFormat?: string | null;
  outputFormatOptions?: string | null;
  inputs?: AgentControllerServiceInputsCreate[];
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  group_ID?: string;
  guardrailed?: boolean;
} & Record<string, any>;
