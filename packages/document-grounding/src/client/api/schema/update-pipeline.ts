/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataRepositoryMetaData } from './data-repository-meta-data.js';
/**
 * Representation of the 'UpdatePipeline' schema.
 */
export type UpdatePipeline = {
  configuration?: {
    /**
     * Optional cron expression for scheduling pipeline execution.
     * Must represent an interval greater than 1 hour.
     *
     * @example "0 \*\/20 * * *"
     */
    cronExpression: string;
  };
  metadata?: {
    dataRepositoryMetadata: DataRepositoryMetaData;
  };
};
