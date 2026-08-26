/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TabularArtifactCommonDefinitionType } from './tabular-artifact-common-definition-type.js';
/**
 * Representation of the 'TabularArtifactCommonDocumentDefinition' schema.
 */
export type TabularArtifactCommonDocumentDefinition = {
  definitionType: TabularArtifactCommonDefinitionType;
  /**
   * CSN document content used to create Tabular Artifact (required if definitionType is DOCUMENT)
   */
  document: Record<string, any>;
};
