/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'OrchestrationConfigPostResponse' schema.
 */
export type OrchestrationConfigPostResponse = {
  message: string;
  /**
   * Format: "uuid".
   */
  id: string;
  scenario: string;
  name: string;
  version: string;
  model_name: string;
} & Record<string, any>;
