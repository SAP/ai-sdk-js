/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { TrckCustomInfoObjectList } from './trck-custom-info-object-list.js';
import type { TrckExecutionId } from './trck-execution-id.js';
import type { TrckGetMetricList } from './trck-get-metric-list.js';
import type { TrckTagList } from './trck-tag-list.js';
import type { TrckTimestamp } from './trck-timestamp.js';
/**
 * Collection of various metrics/tags/labels associated against some execution/deployment
 */
export type TrckGetMetricResource = {
  executionId: TrckExecutionId;
  createdAt?: TrckTimestamp;
  modifiedAt?: TrckTimestamp;
  metrics?: TrckGetMetricList;
  tags?: TrckTagList;
  customInfo?: TrckCustomInfoObjectList;
} & Record<string, any>;
