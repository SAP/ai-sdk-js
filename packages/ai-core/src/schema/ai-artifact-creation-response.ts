/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiId } from './ai-id';
import type { AiArtifactCreationResponseMessage } from './ai-artifact-creation-response-message';
import type { AiArtifactUrl } from './ai-artifact-url';
/**
 * Representation of the 'AiArtifactCreationResponse' schema.
 */
export type AiArtifactCreationResponse = {
  id: AiId;
  message: AiArtifactCreationResponseMessage;
  url: AiArtifactUrl;
} & Record<string, any>;
