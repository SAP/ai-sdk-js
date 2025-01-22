/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiLabelList } from './ai-label-list.js';
import type { AiArtifactName } from './ai-artifact-name.js';
import type { AiArtifactUrl } from './ai-artifact-url.js';
import type { AiArtifactDescription } from './ai-artifact-description.js';
import type { AiScenarioId } from './ai-scenario-id.js';
/**
 * Base data of the artifact; this is the data that can be provided when the artifact is created; `name` and `kind` are required because they constitute important semantic filtering criteria for use in training / inference executables (`name` is a semantic handle of the artifact within a scenario and `kind` specifies the type of usage, e.g. you would only want to allow models in the model operator).
 *
 */
export type AiArtifactPostData = {
  labels?: AiLabelList;
  name: AiArtifactName;
  /**
   * Kind of the artifact, i.e. model or dataset
   */
  kind: 'model' | 'dataset' | 'resultset' | 'other';
  url: AiArtifactUrl;
  description?: AiArtifactDescription;
  scenarioId: AiScenarioId;
} & Record<string, any>;
