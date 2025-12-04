/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { OrchestrationConfig } from './orchestration-config.js';
/**
 * Representation of the 'RuntimeOrchestrationConfigFile' schema.
 */
export type RuntimeOrchestrationConfigFile = {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name?: string;
    version?: string;
    scenario?: string;
  } & Record<string, any>;
  spec?: OrchestrationConfig;
} & Record<string, any>;
