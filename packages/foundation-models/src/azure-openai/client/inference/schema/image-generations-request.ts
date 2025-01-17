/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiImageSize } from './image-size.js';
import type { AzureOpenAiImagesResponseFormat } from './images-response-format.js';
import type { AzureOpenAiImageQuality } from './image-quality.js';
import type { AzureOpenAiImageStyle } from './image-style.js';
/**
 * Representation of the 'AzureOpenAiImageGenerationsRequest' schema.
 */
export type AzureOpenAiImageGenerationsRequest = {
  /**
   * A text description of the desired image(s). The maximum length is 4000 characters.
   * @example "a corgi in a field"
   * Format: "string".
   * Min Length: 1.
   */
  prompt: string;
  /**
   * The number of images to generate.
   * Default: 1.
   * Maximum: 1.
   * Minimum: 1.
   */
  n?: number;
  size?: AzureOpenAiImageSize;
  response_format?: AzureOpenAiImagesResponseFormat;
  /**
   * A unique identifier representing your end-user, which can help to monitor and detect abuse.
   * @example "user123456"
   * Format: "string".
   */
  user?: string;
  quality?: AzureOpenAiImageQuality;
  style?: AzureOpenAiImageStyle;
} & Record<string, any>;
