/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ExecutableBaseData } from './executable-base-data.js';
import type { ExecutableDetailData } from './executable-detail-data.js';
import type { CreationData } from './creation-data.js';
import type { ModificationData } from './modification-data.js';
/**
 * An ML executable consists of a set of ML tasks, flows between tasks, dependencies between tasks, models (or model versions?).
 *
 */
export type Executable = ExecutableBaseData &
  ExecutableDetailData &
  CreationData &
  ModificationData;
