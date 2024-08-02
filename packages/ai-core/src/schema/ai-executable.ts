/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiLabelList } from './ai-label-list';
import type { AiExecutableId } from './ai-executable-id';
import type { AiScenarioId } from './ai-scenario-id';
import type { AiVersionId } from './ai-version-id';
import type { AiExecutableParameterList } from './ai-executable-parameter-list';
import type { AiExecutableArtifactList } from './ai-executable-artifact-list';
/**
 * An ML executable consists of a set of ML tasks, flows between tasks, dependencies between tasks, models (or model versions?).
 *
 */
export type AiExecutable = {
  labels?: AiLabelList;
  /**
   * Name of the executable
   */
  name: string;
  /**
   * Description of the executable
   */
  description?: string;
  id: AiExecutableId;
  scenarioId?: AiScenarioId;
  versionId: AiVersionId;
  parameters?: AiExecutableParameterList;
  inputArtifacts?: AiExecutableArtifactList;
  outputArtifacts?: AiExecutableArtifactList;
  /**
   * Whether this executable is deployable
   */
  deployable: boolean;
  /**
   * Timestamp of resource creation
   * Format: "date-time".
   */
  createdAt: string;
  /**
   * Timestamp of latest resource modification
   * Format: "date-time".
   */
  modifiedAt: string;
} & Record<string, any>;
