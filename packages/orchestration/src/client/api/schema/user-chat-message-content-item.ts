/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ImageContentUrl } from './image-content-url.js';
import type { InputFile } from './input-file.js';
/**
 * Representation of the 'UserChatMessageContentItem' schema.
 */
export type UserChatMessageContentItem = {
  type: 'text' | 'image_url' | 'pdf_file';
  text?: string;
  image_url?: ImageContentUrl;
  pdf_file?: InputFile;
};
