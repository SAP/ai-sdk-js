/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MSSharePointPipelineCreateRequest } from './ms-share-point-pipeline-create-request.js';
import type { S3PipelineCreateRequest } from './s-3-pipeline-create-request.js';
import type { SFTPPipelineCreateRequest } from './sftp-pipeline-create-request.js';
import type { SDMPipelineCreateRequest } from './sdm-pipeline-create-request.js';
import type { WorkZonePipelineCreateRequest } from './work-zone-pipeline-create-request.js';
/**
 * Representation of the 'CreatePipeline' schema.
 */
export type CreatePipeline =
  | ({ type: 'MSSharePoint' } & MSSharePointPipelineCreateRequest)
  | ({ type: 'S3' } & S3PipelineCreateRequest)
  | ({ type: 'SFTP' } & SFTPPipelineCreateRequest)
  | ({ type: 'SDM' } & SDMPipelineCreateRequest)
  | ({ type: 'WorkZone' } & WorkZonePipelineCreateRequest);
