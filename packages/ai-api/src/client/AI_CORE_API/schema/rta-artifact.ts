/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAExecutionId } from './rta-execution-id.js';
import type { RTAArtifactUrl } from './rta-artifact-url.js';
import type { RTAArtifactSignature } from './rta-artifact-signature.js';
import type { RTALabelList } from './rta-label-list.js';
/**
 * Entity having labels
 */
export type RTAArtifact = {
  /**
   * Name of the artifact; this is used for dependent pipelines to resolve an artifact
   * Max Length: 256.
   */
  name: string;
  executionId: RTAExecutionId;
  url: RTAArtifactUrl;
  signature?: RTAArtifactSignature;
  /**
   * Kind of the artifact, i.e. model or dataset
   */
  kind: 'model' | 'dataset' | 'resultset' | 'other';
  labels?: RTALabelList;
  /**
   * Timestamp of resource creation
   * Format: "date-time".
   */
  createdAt: string;
} & Record<string, any>;
