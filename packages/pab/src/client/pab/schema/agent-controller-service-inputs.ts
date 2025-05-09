/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceMessages } from './agent-controller-service-messages.js';
/**
 * Representation of the 'AgentControllerServiceInputs' schema.
 */
export type AgentControllerServiceInputs = {
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
  name?: string;
  description?: string | null;
  /**
   * Default: "string".
   */
  type?: string;
  possibleValues?: string[];
  suggestions?: string[];
} & Record<string, any>;
