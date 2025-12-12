/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { OrchestrationConfig } from './orchestration-config.js';
/**
 * Representation of the 'OrchestrationConfigPostRequest' schema.
 */
export type OrchestrationConfigPostRequest = {
  /**
   * Max Length: 120.
   * Pattern: "^[a-zA-Z0-9_-]+$".
   */
  name: string;
  /**
   * Max Length: 10.
   * Pattern: "^[a-zA-Z0-9._-]+$".
   */
  version: string;
  /**
   * Max Length: 120.
   * Pattern: "^[a-zA-Z0-9_-]+$".
   */
  scenario: string;
  spec: OrchestrationConfig;
} & Record<string, any>;
