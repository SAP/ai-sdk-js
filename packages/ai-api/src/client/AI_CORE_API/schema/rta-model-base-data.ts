/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAExecutableId } from './rta-executable-id.js';
import type { RTAModelVersionList } from './rta-model-version-list.js';
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
} & Record<string, any>;
