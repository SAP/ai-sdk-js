/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DSetUrl } from './d-set-url.js';
/**
 * Response for successful file creation
 */
export type DSetFileCreationResponse = {
  /**
   * File creation response message
   * @example "File creation acknowledged"
   */
  message: string;
  url: DSetUrl;
} & Record<string, any>;
