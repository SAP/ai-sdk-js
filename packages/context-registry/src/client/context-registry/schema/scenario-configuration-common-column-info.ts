/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ScenarioConfigurationCommonColumnInfo' schema.
 */
export type ScenarioConfigurationCommonColumnInfo = {
  /**
   * Name of the column
   * @example "customer_id"
   */
  name: string;
  /**
   * Data type of the column (HANA database type)
   * @example "NVARCHAR"
   */
  datatype: string;
  /**
   * Length of the column (for string/numeric types)
   * @example "100"
   */
  length?: string;
};
