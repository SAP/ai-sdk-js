import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';

import type { PredictRequest } from './client/tabpfn/index.ts';

/** Task-specific configuration accepted by the generated prediction request. */
export type TaskConfig = PredictRequest['task_config'];

/** Custom options for requests to the TabPFN deployment. */
export type TabpfnRequestOptions = CustomRequestConfig;
