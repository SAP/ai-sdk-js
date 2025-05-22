/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAExecutableId } from './rta-executable-id.js';
import type { RTAModelVersionList } from './rta-model-version-list.js';
import type { RTAScenarioId } from './rta-scenario-id.js';
/**
 * Representation of the 'RTAModelBaseData' schema.
 */
export type RTAModelBaseData = {
  /**
   * Name of the model
   */
  model: string;
  executableId: RTAExecutableId;
  /**
   * Description of the model and its capabilities
   */
  description: string;
  versions: RTAModelVersionList;
  /**
   * Display name of the model
   */
  displayName?: string;
  /**
   * Access type of the model
   */
  accessType?: string;
  /**
   * Provider of the model
   */
  provider?: string;
  /**
   * List of scenarioId:executuableId pair where the model supported
   */
  allowedScenarios?: ({
    scenarioId: RTAScenarioId;
    executableId: RTAExecutableId;
  } & Record<string, any>)[];
} & Record<string, any>;
