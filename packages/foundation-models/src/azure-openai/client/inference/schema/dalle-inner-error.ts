/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiInnerErrorCode } from './inner-error-code.js';
import type { AzureOpenAiDalleFilterResults } from './dalle-filter-results.js';
/**
 * Inner error with additional details.
 */
export type AzureOpenAiDalleInnerError = {
  code?: AzureOpenAiInnerErrorCode;
  content_filter_results?: AzureOpenAiDalleFilterResults;
  /**
   * The prompt that was used to generate the image, if there was any revision to the prompt.
   */
  revised_prompt?: string;
} & Record<string, any>;
