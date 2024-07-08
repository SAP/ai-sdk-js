/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ConfigurationName } from './configuration-name.js';
import type { ExecutableId } from './executable-id.js';
import type { ScenarioId } from './scenario-id.js';
import type { ParameterArgumentBindingList } from './parameter-argument-binding-list.js';
import type { ArtifactArgumentBindingList } from './artifact-argument-binding-list.js';
/**
 * Representation of the 'ConfigurationBaseData' schema.
 */
export type ConfigurationBaseData = {
  name: ConfigurationName;
  executableId: ExecutableId;
  scenarioId: ScenarioId;
  parameterBindings?: ParameterArgumentBindingList;
  inputArtifactBindings?: ArtifactArgumentBindingList;
} & Record<string, any>;
