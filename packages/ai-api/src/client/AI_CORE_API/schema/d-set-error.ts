/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Error Response
 */
export type DSetError = {
  /**
   * Min Length: 1.
   */
  code: string;
  /**
   * Min Length: 1.
   */
  message: string;
  /**
   * Min Length: 1.
   */
  target?: string;
  requestId?: string;
  details?: Set<
    {
      /**
       * Min Length: 1.
       */
      code: string;
      /**
       * Min Length: 1.
       */
      message: string;
    } & Record<string, any>
  >;
} & Record<string, any>;
