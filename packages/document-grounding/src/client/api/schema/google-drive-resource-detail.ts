/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { IncludePathsArray } from './include-paths-array.js';
/**
 * Representation of the 'GoogleDriveResourceDetail' schema.
 */
export type GoogleDriveResourceDetail = {
  /**
   * @example "SHARED_DRIVE"
   */
  resourceType?: 'SHARED_FOLDER' | 'SHARED_DRIVE';
  /**
   * @example "0AGVUFpXcXc5Uk9PVA"
   */
  resourceId?: string;
  includePaths?: IncludePathsArray;
} & Record<string, any>;
