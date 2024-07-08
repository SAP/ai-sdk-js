/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Version2 } from './version-2.js';
import type { AiApi } from './ai-api.js';
import type { Extensions } from './extensions.js';
/**
 * Representation of the 'Capabilities' schema.
 */
export type Capabilities = {
  /**
   * The name of the runtime
   * @example "aicore"
   */
  runtimeIdentifier?: string;
  runtimeApiVersion?: Version2;
  description?: string;
  aiApi: AiApi;
  extensions?: Extensions;
} & Record<string, any>;
