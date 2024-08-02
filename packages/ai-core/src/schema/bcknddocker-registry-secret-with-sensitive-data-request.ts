/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * This represents all the meta-data and extra information to be stored as a k8-secret
 */
export type BcknddockerRegistrySecretWithSensitiveDataRequest = {
  /**
   * key:value pairs of data
   */
  data: {
    /**
     * .dockerconfigjson data
     */
    '.dockerconfigjson': string;
  };
} & Record<string, any>;
