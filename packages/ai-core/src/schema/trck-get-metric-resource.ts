/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TrckExecutionId } from './trck-execution-id';
import type { TrckGetMetricList } from './trck-get-metric-list';
import type { TrckTagList } from './trck-tag-list';
import type { TrckCustomInfoObjectList } from './trck-custom-info-object-list';
/**
 * Collection of various metrics/tags/labels associated against some execution/deployment
 */
export type TrckGetMetricResource = {
  executionId: TrckExecutionId;
  metrics?: TrckGetMetricList;
  tags?: TrckTagList;
  customInfo?: TrckCustomInfoObjectList;
} & Record<string, any>;
