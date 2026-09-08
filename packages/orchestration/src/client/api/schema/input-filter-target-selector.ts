/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { AfterLastRoleTargetSelector } from './after-last-role-target-selector.js';
import type { LastMessagesTargetSelector } from './last-messages-target-selector.js';
/**
 * Declarative selector for scoping input filtering to a subset of the combined message list (messages_history prepended to template). Exactly one strategy key must be present; combining keys from different strategies returns 400 Bad Request. If omitted, all configured input content is filtered (backward compatible).
 *
 */
export type InputFilterTargetSelector =
  | AfterLastRoleTargetSelector
  | LastMessagesTargetSelector;
