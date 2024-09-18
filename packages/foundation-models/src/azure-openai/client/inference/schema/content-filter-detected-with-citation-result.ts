/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiContentFilterDetectedResult } from './content-filter-detected-result.js';
/**
 * Representation of the 'AzureOpenAiContentFilterDetectedWithCitationResult' schema.
 */
export type AzureOpenAiContentFilterDetectedWithCitationResult =
  AzureOpenAiContentFilterDetectedResult & {
    citation?: {
      URL?: string;
      license?: string;
    } & Record<string, any>;
  } & Record<string, any>;
