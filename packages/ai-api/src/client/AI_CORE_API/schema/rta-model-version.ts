/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Model version information including whether it is latest version, its deprecation status and retirement date
 */
export type RTAModelVersion = {
  /**
   * Name of model version
   */
  name: string;
  /**
   * Displays whether it is the latest version offered for the model
   */
  isLatest: boolean;
  /**
   * Deprecation status of model
   */
  deprecated: boolean;
  /**
   * Retirement date of model in ISO 8601 timestamp
   */
  retirementDate: string;
} & Record<string, any>;
