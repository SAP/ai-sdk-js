/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiImageResult } from './image-result.js';
/**
 * Representation of the 'AzureOpenAiGenerateImagesResponse' schema.
 */
export type AzureOpenAiGenerateImagesResponse = {
  /**
   * The unix timestamp when the operation was created.
   * @example "1676540381"
   * Format: "unixtime".
   */
  created: number;
  /**
   * The result data of the operation, if successful.
   */
  data: AzureOpenAiImageResult[];
} & Record<string, any>;
