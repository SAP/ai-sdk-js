import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';

import type {
  PredictRequest,
  PredictRequestPart
} from './client/tabpfn/index.ts';

/** Task-specific configuration accepted by the generated prediction request. */
export type TaskConfig = PredictRequest['task_config'];

/** Custom options for requests to the TabPFN deployment. */
export type TabpfnRequestOptions = CustomRequestConfig;

/** Dataset files and configuration for multipart predictions. */
export interface PredictMultipart {
  request: PredictRequestPart;
  x_train?: Blob;
  y_train?: Blob;
  x_test: Blob;
}
