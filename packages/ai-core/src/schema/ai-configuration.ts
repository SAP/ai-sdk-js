/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiConfigurationName } from './ai-configuration-name';
import type { AiExecutableId } from './ai-executable-id';
import type { AiScenarioId } from './ai-scenario-id';
import type { AiParameterArgumentBindingList } from './ai-parameter-argument-binding-list';
import type { AiArtifactArgumentBindingList } from './ai-artifact-argument-binding-list';
import type { AiConfigurationId } from './ai-configuration-id';
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
  scenario?: Record<string, any>;
} & Record<string, any>;
