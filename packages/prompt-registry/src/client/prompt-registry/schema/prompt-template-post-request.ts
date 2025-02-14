/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PromptTemplateSpec } from './prompt-template-spec.js';
/**
 * Representation of the 'PromptTemplatePostRequest' schema.
 */
export type PromptTemplatePostRequest = {
  /**
   * Max Length: 120.
   */
  name: string;
  /**
   * Max Length: 10.
   */
  version: string;
  /**
   * Max Length: 120.
   */
  scenario: string;
  spec: PromptTemplateSpec;
} & Record<string, any>;
