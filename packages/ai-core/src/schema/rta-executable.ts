/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAExecutableId } from './rta-executable-id';
import type { RTAScenarioId } from './rta-scenario-id';
import type { RTAExecutableInputArtifactList } from './rta-executable-input-artifact-list';
import type { RTAExecutableOutputArtifactList } from './rta-executable-output-artifact-list';
import type { RTAExecutableParameterList } from './rta-executable-parameter-list';
import type { RTALabelList } from './rta-label-list';
/**
 * Entity having labels
 */
export type RTAExecutable = {
  id: RTAExecutableId;
  /**
   * Name of the executable
   */
  name: string;
  /**
   * Description of the executable
   */
  description?: string;
  scenarioId: RTAScenarioId;
  inputArtifacts?: RTAExecutableInputArtifactList;
  outputArtifacts?: RTAExecutableOutputArtifactList;
  parameters?: RTAExecutableParameterList;
  /**
   * Whether this pipeline is deployable
   */
  deployable: boolean;
  labels?: RTALabelList;
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
