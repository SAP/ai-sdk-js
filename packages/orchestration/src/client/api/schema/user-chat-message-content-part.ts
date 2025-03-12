/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'UserChatMessageContentPart' schema.
 */
export type UserChatMessageContentPart = {
  /**
   * The type of the content part.
   */
  type: 'text' | 'image_url';
  /**
   * The text content.
   */
  text?: string;
  /**
   * The URL of the image content.
   */
  image_url?: string;
};
