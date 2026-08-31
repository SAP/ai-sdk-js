/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ScenarioConfigurationCommonMetadataItem } from './scenario-configuration-common-metadata-item.js';
/**
 * Representation of the 'ScenarioConfigurationCommonTabularArtifact' schema.
 */
export type ScenarioConfigurationCommonTabularArtifact = {
  /**
   * Name of the Tabular Artifact
   * @example "customer-ta"
   */
  name: string;
  /**
   * Name of the virtual table in the database
   * @example "v_abcddfdddf"
   */
  virtualTableName: string;
  /**
   * Array of metadata objects for the tabular artifact
   * Min Items: 1.
   */
  metadata?: ScenarioConfigurationCommonMetadataItem[];
};
