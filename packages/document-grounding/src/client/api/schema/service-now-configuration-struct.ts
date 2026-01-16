/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ServiceNowConfig } from './service-now-config.js';
/**
 * Representation of the 'ServiceNowConfigurationStruct' schema.
 */
export type ServiceNowConfigurationStruct = {
  /**
   * @example "destination-name"
   */
  destination: string;
  serviceNow?: ServiceNowConfig;
  /**
   * @example "uuid"
   */
  metadataConfigId?: string;
  /**
   * Optional cron expression for scheduling pipeline execution.
   * Must represent an interval greater than 1 hour.
   *
   * @example "0 \*\/20 * * *"
   */
  cronExpression?: string;
};
