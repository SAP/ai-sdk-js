/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MSSharePointPipelineGetResponse } from './ms-share-point-pipeline-get-response.js';
import type { S3PipelineGetResponse } from './s-3-pipeline-get-response.js';
import type { SFTPPipelineGetResponse } from './sftp-pipeline-get-response.js';
/**
 * Representation of the 'GetPipeline' schema.
 */
export type GetPipeline =
  | ({ type: 'MSSharePoint' } & MSSharePointPipelineGetResponse)
  | ({ type: 'S3' } & S3PipelineGetResponse)
  | ({ type: 'SFTP' } & SFTPPipelineGetResponse);
