/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAArtifactName } from './rta-artifact-name.js';
import type { RTAArtifactUrl } from './rta-artifact-url.js';
import type { RTAArtifactSignature } from './rta-artifact-signature.js';
/**
 * Required for execution
 */
export type RTAInputArtifactArgumentBinding = {
  name: RTAArtifactName;
  url: RTAArtifactUrl;
  signature?: RTAArtifactSignature;
} & Record<string, any>;
