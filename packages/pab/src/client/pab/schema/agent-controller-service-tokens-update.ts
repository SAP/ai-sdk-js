/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AgentControllerServiceTokensUpdate' schema.
 */
export type AgentControllerServiceTokensUpdate = {
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
