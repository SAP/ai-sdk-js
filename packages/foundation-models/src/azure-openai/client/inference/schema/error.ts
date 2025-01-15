/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiErrorBase } from './error-base.js';
import type { AzureOpenAiInnerError } from './inner-error.js';
/**
 * Representation of the 'AzureOpenAiError' schema.
 */
export type AzureOpenAiError = AzureOpenAiErrorBase & {
  param?: string;
  type?: string;
  inner_error?: AzureOpenAiInnerError;
} & Record<string, any>;
