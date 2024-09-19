/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiErrorBase } from './error-base.js';
import type { AzureOpenAiDalleInnerError } from './dalle-inner-error.js';
/**
 * Representation of the 'AzureOpenAiDalleError' schema.
 */
export type AzureOpenAiDalleError = AzureOpenAiErrorBase & {
  param?: string;
  type?: string;
  inner_error?: AzureOpenAiDalleInnerError;
} & Record<string, any>;
