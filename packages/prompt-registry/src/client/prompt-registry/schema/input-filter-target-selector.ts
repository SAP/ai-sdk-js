/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { AfterLastRoleTargetSelector } from './after-last-role-target-selector.js';
import type { LastMessagesTargetSelector } from './last-messages-target-selector.js';
/**
 * Selector for scoping input filtering to a subset of the combined message list (messages_history prepended to template). If not present, all input content is filtered.
 *
 */
export type InputFilterTargetSelector =
  | AfterLastRoleTargetSelector
  | LastMessagesTargetSelector;
