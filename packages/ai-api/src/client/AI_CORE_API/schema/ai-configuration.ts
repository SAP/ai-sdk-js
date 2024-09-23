/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiConfigurationName } from './ai-configuration-name.js';
import type { AiExecutableId } from './ai-executable-id.js';
import type { AiScenarioId } from './ai-scenario-id.js';
import type { AiParameterArgumentBindingList } from './ai-parameter-argument-binding-list.js';
import type { AiArtifactArgumentBindingList } from './ai-artifact-argument-binding-list.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
import type { AiScenario } from './ai-scenario.js';
/**
 * Representation of the 'AiConfiguration' schema.
 */
export type AiConfiguration = {
  name: AiConfigurationName;
  executableId: AiExecutableId;
  scenarioId: AiScenarioId;
  parameterBindings?: AiParameterArgumentBindingList;
  inputArtifactBindings?: AiArtifactArgumentBindingList;
  id: AiConfigurationId;
  /**
   * Timestamp of resource creation
   * Format: "date-time".
   */
  createdAt: string;
  scenario?: AiScenario | any | null;
} & Record<string, any>;
