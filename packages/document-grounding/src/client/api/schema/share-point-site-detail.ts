/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { IncludePathsArray } from './include-paths-array.js';
/**
 * Representation of the 'SharePointSiteDetail' schema.
 */
export type SharePointSiteDetail = {
  /**
   * @example "sharepoint-site-id"
   */
  id?: string;
  /**
   * @example "sharepoint-site-name"
   */
  name: string;
  includePaths?: IncludePathsArray;
} & Record<string, any>;
