/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiImageDetailLevel } from './image-detail-level.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestMessageContentPartImage' schema.
 */
export type AzureOpenAiChatCompletionRequestMessageContentPartImage = {
  type: string;
} & {
  /**
   * Either a URL of the image or the base64 encoded image data.
   * Format: "uri".
   */
  url: string;
  detail?: AzureOpenAiImageDetailLevel;
} & Record<string, any>;
