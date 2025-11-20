/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ImageContentUrl } from './image-content-url.js';
/**
 * Representation of the 'UserChatMessageContentItem' schema.
 */
export type UserChatMessageContentItem = {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: ImageContentUrl;
};
