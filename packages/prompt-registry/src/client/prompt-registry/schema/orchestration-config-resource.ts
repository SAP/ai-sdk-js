/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PromptRegistryOrchestrationConfig } from './prompt-registry-orchestration-config.js';
/**
 * Representation of the 'OrchestrationConfigResource' schema.
 */
export type OrchestrationConfigResource = {
  /**
   * Format: "uuid".
   */
  id?: string;
  name?: string;
  version?: string;
  scenario?: string;
  /**
   * Format: "timestamp".
   */
  creation_timestamp?: string;
  managed_by?: string;
  is_version_head?: boolean;
  resource_group_id?: string;
  spec?: PromptRegistryOrchestrationConfig;
} & Record<string, any>;
