/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Repository details
 */
export type BckndArgoCDRepositoryDetails = {
  /**
   * The name of the repository
   */
  name?: string;
  /**
   * The repository URL
   */
  url?: string;
  /**
   * The status of the repository's on-boarding
   * @example "COMPLETED"
   */
  status?: 'ERROR' | 'IN-PROGRESS' | 'COMPLETED';
} & Record<string, any>;
