/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AgentControllerServiceToolkitsCreate' schema.
 */
export type AgentControllerServiceToolkitsCreate = {
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  ID: string;
  /**
   * @example "Calculator"
   */
  name?: string;
  /**
   * @example "calculator"
   */
  type?: string;
  /**
   * @example "UUID"
   */
  instanceId?: string;
} & Record<string, any>;
