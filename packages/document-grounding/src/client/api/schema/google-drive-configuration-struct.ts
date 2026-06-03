/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { GoogleDriveConfig } from './google-drive-config.js';
/**
 * Representation of the 'GoogleDriveConfigurationStruct' schema.
 */
export type GoogleDriveConfigurationStruct = {
  /**
   * @example "destination-name"
   */
  destination: string;
  googleDrive: GoogleDriveConfig;
  /**
   * Optional cron expression for scheduling pipeline execution.
   * Must represent an interval greater than 1 hour.
   *
   * @example "0 \*\/20 * * *"
   */
  cronExpression?: string;
  /**
   * @example "uuid"
   */
  metadataConfigId?: string;
} & Record<string, any>;
