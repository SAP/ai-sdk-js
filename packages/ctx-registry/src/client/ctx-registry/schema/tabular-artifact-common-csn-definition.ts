import type { TabularArtifactCommonAutoDefinition } from './tabular-artifact-common-auto-definition.js';
/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TabularArtifactCommonDocumentDefinition } from './tabular-artifact-common-document-definition.js';
import type { TabularArtifactCommonReferenceDefinition } from './tabular-artifact-common-reference-definition.js';
/**
 * Representation of the 'TabularArtifactCommonCSNDefinition' schema.
 */
export type TabularArtifactCommonCSNDefinition =
  | ({ definitionType: 'DOCUMENT' } & TabularArtifactCommonDocumentDefinition)
  | ({ definitionType: 'REFERENCE' } & TabularArtifactCommonReferenceDefinition)
  | ({ definitionType: 'AUTO' } & TabularArtifactCommonAutoDefinition);
