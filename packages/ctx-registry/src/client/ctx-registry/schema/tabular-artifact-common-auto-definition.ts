/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TabularArtifactCommonDefinitionType } from './tabular-artifact-common-definition-type.js';
/**
 * Representation of the 'TabularArtifactCommonAutoDefinition' schema.
 */
export type TabularArtifactCommonAutoDefinition = {
  definitionType: TabularArtifactCommonDefinitionType;
  /**
   * Optional configuration for AUTO schema derivation
   */
  autoConfig?: {
    /**
     * Optional CSV-specific options (only for CSV type files)
     */
    csvOptions?: {
      /**
       * Whether CSV has column names in first row
       * Default: true.
       */
      columnListInFirstRow?: boolean;
      /**
       * CSV delimiter character
       * Default: ",".
       */
      delimiter?: string;
    };
  };
};
