/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceTokensCreate } from './agent-controller-service-tokens-create.js';
/**
 * Representation of the 'AgentControllerServiceTracesUpdate' schema.
 */
export type AgentControllerServiceTracesUpdate = {
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
