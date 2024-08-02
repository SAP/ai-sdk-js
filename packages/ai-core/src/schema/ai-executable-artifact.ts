/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiLabelList } from './ai-label-list';
/**
 * Representation of the 'AiExecutableArtifact' schema.
 */
export type AiExecutableArtifact = {
  /**
   * Name of the executable input artifacts
   */
  name: string;
  /**
   * Artifact kind (model, dataset, other)
   */
  kind?: string;
  /**
   * Description of the signature argument
   */
  description?: string;
  labels?: AiLabelList;
} & Record<string, any>;
