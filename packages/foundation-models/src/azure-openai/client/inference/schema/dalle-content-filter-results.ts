/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiContentFilterSeverityResult } from './content-filter-severity-result.js';
/**
 * Information about the content filtering results.
 */
export type AzureOpenAiDalleContentFilterResults = {
  sexual?: AzureOpenAiContentFilterSeverityResult;
  violence?: AzureOpenAiContentFilterSeverityResult;
  hate?: AzureOpenAiContentFilterSeverityResult;
  self_harm?: AzureOpenAiContentFilterSeverityResult;
} & Record<string, any>;
