/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiContentFilterResultsBase } from './content-filter-results-base.js';
import type { AzureOpenAiContentFilterDetectedResult } from './content-filter-detected-result.js';
/**
 * Information about the content filtering category (hate, sexual, violence, self_harm), if it has been detected, as well as the severity level (very_low, low, medium, high-scale that determines the intensity and risk level of harmful content) and if it has been filtered or not. Information about jailbreak content and profanity, if it has been detected, and if it has been filtered or not. And information about customer block list, if it has been filtered and its id.
 */
export type AzureOpenAiContentFilterPromptResults =
  AzureOpenAiContentFilterResultsBase & {
    jailbreak?: AzureOpenAiContentFilterDetectedResult;
  } & Record<string, any>;
