/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceMessages } from './agent-controller-service-messages.js';
import type { Count } from './count.js';
import type { AgentControllerServiceAgents } from './agent-controller-service-agents.js';
/**
 * Representation of the 'AgentControllerServiceThreads' schema.
 */
export type AgentControllerServiceThreads = {
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
   * @example "Sustainability Report 2023"
   */
  name?: string;
  messages?: AgentControllerServiceMessages[];
  'messages@count'?: Count;
  /**
   * @example "running"
   * Default: "success".
   */
  state?: string;
  agent?: AgentControllerServiceAgents;
} & Record<string, any>;
