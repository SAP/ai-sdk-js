import type { TabularArtifactAsyncTabularArtifactErrorMessage } from './tabular-artifact-async-tabular-artifact-error-message.js';
import type { TabularArtifactCommonCSNDefinition } from './tabular-artifact-common-csn-definition.js';
/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TabularArtifactCommonTabularArtifactStatus } from './tabular-artifact-common-tabular-artifact-status.js';
/**
 * Representation of the 'TabularArtifactAsyncTabularArtifactDetails' schema.
 */
export type TabularArtifactAsyncTabularArtifactDetails = {
  /**
   * Unique identifier of the Tabular Artifact
   */
  id: string;
  /**
   * Name of the Tabular Artifact
   */
  name: string;
  /**
   * Tenant identifier
   */
  tenantId: string;
  /**
   * Resource group identifier
   */
  resourceGroupId: string;
  dataDestinationName: string;
  virtualTableName?: string | null;
  remoteSourceName?: string | null;
  path: string;
  type: 'CSV' | 'PARQUET' | 'DELTA';
  status: TabularArtifactCommonTabularArtifactStatus;
  errorMessage?: TabularArtifactAsyncTabularArtifactErrorMessage;
  csnMetadata?:
    | ({
        /**
         * Name of the entity in CSN model
         */
        entityName?: string;
        /**
         * List of selected columns from the source file
         */
        selectedColumns?: string[];
        definition?: TabularArtifactCommonCSNDefinition;
      } & Record<string, any>)
    | null;
  /**
   * Schema metadata containing column definitions based on CSN
   *
   */
  metadata?: ({
    /**
     * Type of metadata (e.g., csn)
     * @example "csn"
     */
    type: string;
    /**
     * Array of column definitions extracted from CSN schema
     */
    columns: ({
      /**
       * Column name (extracted from CSN element key)
       */
      name: string;
      /**
       * CDS data type (e.g., cds.String, cds.Integer, cds.Decimal, cds.Boolean, cds.Date, cds.DateTime)
       * @example "cds.String"
       */
      cdsType: string;
      /**
       * Column length (for string types, from CSN element length property)
       * @example 5000
       * Minimum: 1.
       */
      length?: number;
      /**
       * Precision (for decimal types - total number of digits)
       * @example 15
       * Minimum: 1.
       */
      precision?: number;
      /**
       * Scale (for decimal types - digits after decimal point)
       * @example 2
       */
      scale?: number;
    } & Record<string, any>)[];
  } & Record<string, any>)[];
  /**
   * Format: "date-time".
   */
  createdAt: string;
  /**
   * Format: "date-time".
   */
  updatedAt: string;
} & Record<string, any>;
