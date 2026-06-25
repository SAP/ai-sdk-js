/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'MetadataConfigurationRequest' schema.
 */
export type MetadataConfigurationRequest = {
  /**
   * If provided, must be a valid UUID. If not provided, a new UUID will be generated.
   */
  id?: string;
  /**
   * If provided, must be a valid string. If not provided, will be same as id.
   */
  name?: string;
  /**
   * Contains destination name containing credentials to access the data repository.
   */
  destinationName: string;
  /**
   * The data repository type for which this configuration is being created.
   * @example "MSSharePoint"
   */
  dataRepositoryType: 'MSSharePoint' | 'S3' | 'SFTP';
  /**
   * @example [
   *   "/site/documents",
   *   "/shared/team"
   * ]
   * Min Items: 1.
   */
  includePaths?: string[];
  labels?: ({
    /**
     * @example "department"
     */
    key: string;
    /**
     * @example "finance"
     */
    value: string;
  } & Record<string, any>)[];
} & Record<string, any>;
