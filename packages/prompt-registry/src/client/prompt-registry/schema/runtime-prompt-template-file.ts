/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PromptTemplateSpec } from './prompt-template-spec.js';
/**
 * Representation of the 'RuntimePromptTemplateFile' schema.
 */
export type RuntimePromptTemplateFile = {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name?: string;
    version?: string;
    scenario?: string;
  } & Record<string, any>;
  spec?: PromptTemplateSpec;
} & Record<string, any>;
