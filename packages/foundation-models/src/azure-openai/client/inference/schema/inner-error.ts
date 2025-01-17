/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiInnerErrorCode } from './inner-error-code.js';
import type { AzureOpenAiContentFilterPromptResults } from './content-filter-prompt-results.js';
/**
 * Inner error with additional details.
 */
export type AzureOpenAiInnerError = {
  code?: AzureOpenAiInnerErrorCode;
  content_filter_results?: AzureOpenAiContentFilterPromptResults;
} & Record<string, any>;
