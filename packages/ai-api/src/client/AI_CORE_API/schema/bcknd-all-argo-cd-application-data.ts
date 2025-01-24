/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndArgoCDApplicationData } from './bcknd-argo-cd-application-data.js';
/**
 * list of applications
 */
export type BckndAllArgoCDApplicationData = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: BckndArgoCDApplicationData[];
} & Record<string, any>;
