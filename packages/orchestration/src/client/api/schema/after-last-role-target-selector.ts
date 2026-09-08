/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AfterLastRoleTargetSelector' schema.
 */
export type AfterLastRoleTargetSelector = {
  /**
   * Filter all messages after the last message with this role in the combined message list. If no message with this role exists, or the role is the last message, the filter is individually skipped.
   *
   */
  after_last_role: 'system' | 'user' | 'assistant' | 'developer' | 'tool';
};
