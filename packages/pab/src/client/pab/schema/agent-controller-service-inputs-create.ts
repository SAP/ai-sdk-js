/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AgentControllerServiceInputsCreate' schema.
 */
export type AgentControllerServiceInputsCreate = {
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  ID: string;
  name?: string;
  description?: string | null;
  /**
   * Default: "string".
   */
  type?: string;
  possibleValues?: string[];
  suggestions?: string[];
} & Record<string, any>;
