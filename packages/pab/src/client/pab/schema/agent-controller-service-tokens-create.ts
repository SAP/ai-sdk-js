/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AgentControllerServiceTokensCreate' schema.
 */
export type AgentControllerServiceTokensCreate = {
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  ID: string;
  modelName?: string;
  /**
   * Format: "int32".
   */
  inputTokens?: number;
  /**
   * Format: "int32".
   */
  outputTokens?: number;
  /**
   * Default: "0.0".
   */
  inputTokensCost?: number | string;
  /**
   * Default: "0.0".
   */
  outputTokensCost?: number | string;
} & Record<string, any>;
