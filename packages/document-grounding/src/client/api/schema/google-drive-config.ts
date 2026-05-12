/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { IncludePathsArray } from './include-paths-array.js';
/**
 * Representation of the 'GoogleDriveConfig' schema.
 */
export type GoogleDriveConfig = {
  /**
   * @example "SHARED_DRIVE"
   */
  resourceType: 'SHARED_DRIVE' | 'NEW_ENUM_CONSTANT';
  /**
   * @example "0AGVUFpXcXc5Uk9PVA"
   */
  resourceId?: string;
  includePaths?: IncludePathsArray;
  newRequiredField: string;
} & Record<string, any>;
