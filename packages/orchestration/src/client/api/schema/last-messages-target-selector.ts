/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'LastMessagesTargetSelector' schema.
 */
export type LastMessagesTargetSelector = {
  /**
   * Number of messages from the end of the combined message list to include in filtering. Must be >= 1 (0 is not allowed and returns 400 Bad Request). If larger than the message list length, all messages are filtered.
   *
   * Minimum: 1.
   */
  last_messages: number;
};
