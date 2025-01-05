/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ExecutionId2 } from './execution-id-2.js';
import type { MetricList } from './metric-list.js';
import type { TagList } from './tag-list.js';
import type { CustomInfoObjectList } from './custom-info-object-list.js';
/**
 * Collection of various metrics/tags/labels associated against some execution/deployment
 */
export type MetricResource = {
  executionId: ExecutionId2;
  metrics?: MetricList;
  tags?: TagList;
  customInfo?: CustomInfoObjectList;
} & Record<string, any>;