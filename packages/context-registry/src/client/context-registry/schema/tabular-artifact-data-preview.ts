/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'TabularArtifactDataPreview' schema.
 */
export type TabularArtifactDataPreview = {
  /**
   * Name of the Tabular Artifact
   */
  name: string;
  /**
   * Array of column names in the result set
   */
  columns: string[];
  /**
   * Array of row objects (up to 10 rows)
   */
  data: Record<string, any>[];
} & Record<string, any>;
