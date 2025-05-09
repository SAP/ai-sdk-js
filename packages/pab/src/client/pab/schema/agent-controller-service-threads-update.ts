/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceMessagesCreate } from './agent-controller-service-messages-create.js';
/**
 * Representation of the 'AgentControllerServiceThreadsUpdate' schema.
 */
export type AgentControllerServiceThreadsUpdate = {
  /**
   * @example "Sustainability Report 2023"
   */
  name?: string;
  messages?: AgentControllerServiceMessagesCreate[];
} & Record<string, any>;
