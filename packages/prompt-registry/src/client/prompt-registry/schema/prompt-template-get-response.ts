/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PromptTemplateSpec } from './prompt-template-spec.js';
/**
 * Representation of the 'PromptTemplateGetResponse' schema.
 */
export type PromptTemplateGetResponse = {
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
  creationTimestamp?: string;
  managedBy?: string;
  isVersionHead?: boolean;
  spec?: PromptTemplateSpec;
} & Record<string, any>;
