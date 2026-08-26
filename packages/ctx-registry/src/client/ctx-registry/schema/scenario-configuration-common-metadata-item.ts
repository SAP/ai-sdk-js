/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ScenarioConfigurationCommonColumnInfo } from './scenario-configuration-common-column-info.js';
/**
 * Metadata item for tabular artifact. Contains virtual table metadata information.
 *
 */
export type ScenarioConfigurationCommonMetadataItem = {
  /**
   * Type of metadata
   * @example "virtualTable"
   */
  type?: string;
  /**
   * Name of the CSN entity from TABULAR_ARTIFACT.CSN_ENTITY_NAME
   * @example "SalesEntity"
   */
  entityName?: string | null;
  /**
   * List of column definitions from the virtual table. Only present when includeMetadata=true is specified in the request.
   *
   */
  columns?: ScenarioConfigurationCommonColumnInfo[] | null;
};
