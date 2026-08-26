/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TabularArtifactCommonDefinitionType } from './tabular-artifact-common-definition-type.js';
/**
 * Representation of the 'TabularArtifactCommonReferenceDefinition' schema.
 */
export type TabularArtifactCommonReferenceDefinition = {
  definitionType: TabularArtifactCommonDefinitionType;
  documentReference: {
    /**
     * Absolute path to the file on the data destination (must start with '/')
     * @example "/data/ingest/customer_data/csn_metadata.json"
     * Pattern: "^\\/.*".
     */
    path: string;
  };
};
