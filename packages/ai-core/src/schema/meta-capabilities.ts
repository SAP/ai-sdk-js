/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MetaVersion } from './meta-version';
import type { MetaAiApi } from './meta-ai-api';
import type { MetaExtensions } from './meta-extensions';
/**
 * Representation of the 'MetaCapabilities' schema.
 */
export type MetaCapabilities = {
  /**
   * The name of the runtime
   * @example "aicore"
   */
  runtimeIdentifier?: string;
  runtimeApiVersion?: MetaVersion;
  description?: string;
  aiApi: MetaAiApi;
  extensions?: MetaExtensions;
} & Record<string, any>;
