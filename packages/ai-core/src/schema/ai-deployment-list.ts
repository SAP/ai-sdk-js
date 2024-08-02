/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiDeployment } from './ai-deployment';
/**
 * Representation of the 'AiDeploymentList' schema.
 */
export type AiDeploymentList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiDeployment[];
} & Record<string, any>;
