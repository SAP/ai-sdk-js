/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ArtifactId } from './artifact-id.js';
import type { ScenarioId } from './scenario-id.js';
import type { ConfigurationId } from './configuration-id.js';
import type { ExecutionId } from './execution-id.js';
/**
 * Representation of the 'ArtifactDetailData' schema.
 */
export type ArtifactDetailData = {
  id: ArtifactId;
  scenarioId: ScenarioId;
  configurationId?: ConfigurationId;
  executionId?: ExecutionId;
} & Record<string, any>;
