/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceMessagesCreate } from './agent-controller-service-messages-create.js';
/**
 * Representation of the 'AgentControllerServiceThreadsCreate' schema.
 */
export type AgentControllerServiceThreadsCreate = {
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  ID: string;
  /**
   * @example "Sustainability Report 2023"
   */
  name?: string;
  messages?: AgentControllerServiceMessagesCreate[];
} & Record<string, any>;
