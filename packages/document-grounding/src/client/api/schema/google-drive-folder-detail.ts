/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { IncludePathsArray } from './include-paths-array.js';
/**
 * Representation of the 'GoogleDriveFolderDetail' schema.
 */
export type GoogleDriveFolderDetail = {
  /**
   * @example "1n0SMFydu2ru3mgn7eK_BYpOlmhK5Vhij"
   */
  id?: string;
  /**
   * @example "0AGVUFpXcXc5Uk9PVA"
   */
  driveId?: string;
  /**
   * @example "SHARED_FOLDER"
   */
  driverType?: 'SHARED_FOLDER' | 'SHARED_DRIVE';
  includePaths?: IncludePathsArray;
} & Record<string, any>;
