/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiDalleContentFilterResults } from './dalle-content-filter-results.js';
import type { AzureOpenAiDalleFilterResults } from './dalle-filter-results.js';
/**
 * The image url or encoded image if successful, and an error otherwise.
 */
export type AzureOpenAiImageResult = {
  /**
   * The image url.
   * @example "https://www.contoso.com"
   */
  url?: string;
  /**
   * The base64 encoded image.
   */
  b64_json?: string;
  content_filter_results?: AzureOpenAiDalleContentFilterResults;
  /**
   * The prompt that was used to generate the image, if there was any revision to the prompt.
   */
  revised_prompt?: string;
  prompt_filter_results?: AzureOpenAiDalleFilterResults;
} & Record<string, any>;
