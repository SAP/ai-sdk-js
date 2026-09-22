/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { AutoDefinition } from './auto-definition.js';
import type { DocumentDefinition } from './document-definition.js';
import type { ReferenceDefinition } from './reference-definition.js';
/**
 * Representation of the 'CSNDefinition' schema.
 */
export type CSNDefinition =
  | ({ definitionType: 'DOCUMENT' } & DocumentDefinition)
  | ({ definitionType: 'REFERENCE' } & ReferenceDefinition)
  | ({ definitionType: 'AUTO' } & AutoDefinition);
