/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiArtifactId } from './ai-artifact-id.js';
/**
 * Required for execution
 * Result of activation
 *
 */
export type AiArtifactArgumentBinding = {
  /**
   * Max Length: 256.
   */
  key: string;
  artifactId: AiArtifactId;
} & Record<string, any>;
