/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceAgents } from './agent-controller-service-agents.js';
/**
 * Representation of the 'AgentControllerServiceToolkits' schema.
 */
export type AgentControllerServiceToolkits = {
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
  /**
   * @example "Calculator"
   */
  name?: string;
  /**
   * @example "1"
   */
  agent?: AgentControllerServiceAgents;
  /**
   * @example "calculator"
   */
  type?: string;
  /**
   * @example "UUID"
   */
  instanceId?: string;
} & Record<string, any>;
