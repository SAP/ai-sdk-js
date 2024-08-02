/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAtimestamp } from './rt-atimestamp';
import type { RTAmessage } from './rt-amessage';
/**
 * Common log record.
 */
export type RTALogCommonResultItem = {
  timestamp?: RTAtimestamp;
  msg?: RTAmessage;
} & Record<string, any>;
