/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'MetadataConfigurationStruct' schema.
 */
export type MetadataConfigurationStruct = {
  /**
   * @example "uuid"
   * Min Length: 1.
   */
  metadataConfigId: string;
  /**
   * Optional cron expression for scheduling pipeline execution.
   * Must represent an interval greater than 1 hour.
   *
   * @example "0 \*\/20 * * *"
   */
  cronExpression?: string;
} & Record<string, any>;
