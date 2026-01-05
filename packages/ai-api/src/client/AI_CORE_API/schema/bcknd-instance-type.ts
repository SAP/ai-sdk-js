/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BckndInstanceType' schema.
 */
export type BckndInstanceType = Record<
  string,
  {
    /**
     * Memory allocated for the instance type (e.g., "16Gi")
     */
    memory: string;
    /**
     * Number of CPU cores allocated for the instance type
     */
    cpu: number;
    /**
     * Number of GPUs allocated for the instance type
     */
    gpu: number;
    /**
     * Number of billable units per hour for the instance type
     */
    billableUnitsPerHour: number;
  } & Record<string, any>
>;
