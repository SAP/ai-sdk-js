/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceTokensCreate } from './agent-controller-service-tokens-create.js';
/**
 * Representation of the 'AgentControllerServiceTracesCreate' schema.
 */
export type AgentControllerServiceTracesCreate = {
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  ID: string;
  fromId?: string | null;
  toId?: string | null;
  type?:
    | 'start'
    | 'end'
    | 'abort'
    | 'agent'
    | 'edge'
    | 'toolkit'
    | 'toolkitResource'
    | 'error';
  tokens?: AgentControllerServiceTokensCreate[];
  data?: string | null;
} & Record<string, any>;
