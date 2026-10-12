/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SamplingRandomConfig' schema.
 */
export type SamplingRandomConfig = {
  /**
   * When true, uses HASH_SHA256 of indexColumn for ordering instead of RAND(), producing the same row order on every call for the same data.
   */
  deterministic?: boolean;
} & Record<string, any>;
