/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Template } from './template.js';
import type { PromptTemplateGetResponse } from './prompt-template-get-response.js';
/**
 * Representation of the 'PromptTemplateSubstitutionResponse' schema.
 */
export type PromptTemplateSubstitutionResponse = {
  parsedPrompt?: Template[];
  resource?: PromptTemplateGetResponse;
} & Record<string, any>;
