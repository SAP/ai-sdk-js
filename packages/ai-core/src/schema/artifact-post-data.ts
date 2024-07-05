/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ArtifactBaseData } from './artifact-base-data.js';
import type { ScenarioId } from './scenario-id.js';
/**
 * Representation of the 'ArtifactPostData' schema.
 */
export type ArtifactPostData = ArtifactBaseData & {
  scenarioId: ScenarioId;
} & Record<string, any>;
