/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { DefinitionType } from './definition-type.js';
/**
 * Representation of the 'DocumentDefinition' schema.
 */
export type DocumentDefinition = {
  definitionType: DefinitionType;
  /**
   * CSN document content used to create Tabular Artifact (required if definitionType is DOCUMENT)
   */
  document: Record<string, any>;
};
