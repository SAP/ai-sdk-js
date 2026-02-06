/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BckndArgoCDApplicationDataResponse' schema.
 */
export type BckndArgoCDApplicationDataResponse = {
  /**
   * URL of the repository to synchronise
   */
  repositoryUrl: string;
  /**
   * revision to synchronise
   */
  revision: string;
  /**
   * path within the repository to synchronise
   */
  path: string;
  /**
   * ArgoCD application name in the response body
   * Max Length: 63.
   * Min Length: 3.
   * Pattern: "^[a-z0-9\\-]+$".
   */
  applicationName?: string;
} & Record<string, any>;
