/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ImageContentUrl } from './image-content-url.js';
import type { FileContent } from './file-content.js';
/**
 * Representation of the 'UserChatMessageContentItem' schema.
 */
export type UserChatMessageContentItem = {
  type: 'text' | 'image_url' | 'file';
  text?: string;
  image_url?: ImageContentUrl;
  file?: FileContent;
};
