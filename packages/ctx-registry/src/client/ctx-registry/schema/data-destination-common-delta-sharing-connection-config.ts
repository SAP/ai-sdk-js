/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DataDestinationCommonDeltaSharingConnectionConfig' schema.
 */
export type DataDestinationCommonDeltaSharingConnectionConfig = {
  /**
   * Delta Sharing server hostname. Only alphanumeric characters, hyphens, dots, and an optional port are allowed. Do not include 'https://' or any URL scheme.
   * @example "ccc727c8-ffff-4c37-ffff-ede322dcfa8f.sharing.hdl.canary-eu10.hanacloud.ondemand.com"
   * Pattern: "^[a-zA-Z0-9]([a-zA-Z0-9\\-\\.]*[a-zA-Z0-9])?(:[0-9]+)?$".
   */
  host: string;
  /**
   * Delta Sharing provider. Optional, defaults to hdlf if not specified.
   */
  provider?: 'hdlf';
};
