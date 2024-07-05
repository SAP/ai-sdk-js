/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Labeled } from './labeled.js';
import type { ArtifactName } from './artifact-name.js';
import type { ArtifactUrl } from './artifact-url.js';
import type { ArtifactDescription } from './artifact-description.js';
/**
 * Representation of the 'ArtifactBaseData' schema.
 */
export type ArtifactBaseData = Labeled & {
  name: ArtifactName;
  /**
   * Kind of the artifact, i.e. model or dataset
   */
  kind: 'model' | 'dataset' | 'resultset' | 'other.js';
  url: ArtifactUrl;
  description?: ArtifactDescription;
} & Record<string, any>;
