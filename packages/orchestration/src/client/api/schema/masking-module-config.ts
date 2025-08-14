/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MaskingProviderConfig } from './masking-provider-config.js';
/**
 * Representation of the 'MaskingModuleConfig' schema.
 */
export type MaskingModuleConfig =
  | {
      /**
       * List of masking service providers
       * Min Items: 1.
       */
      providers: MaskingProviderConfig[];
    }
  | {
      /**
       * This field is **DEPRECATED** and will be removed on August 05, 2026. Use `providers` property instead. List of masking service providers.
       * @deprecated
       * Min Items: 1.
       */
      masking_providers: MaskingProviderConfig[];
    };
