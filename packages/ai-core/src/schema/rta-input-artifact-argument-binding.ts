/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAArtifactName } from './rta-artifact-name';
import type { RTAArtifactUrl } from './rta-artifact-url';
import type { RTAArtifactSignature } from './rta-artifact-signature';
/**
 * Required for execution
 */
export type RTAInputArtifactArgumentBinding = {
  name: RTAArtifactName;
  url: RTAArtifactUrl;
  signature?: RTAArtifactSignature;
} & Record<string, any>;
