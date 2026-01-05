/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MSSharePointPipelineMinimalResponse } from './ms-share-point-pipeline-minimal-response.js';
import type { S3PipelineMinimalResponse } from './s-3-pipeline-minimal-response.js';
import type { SFTPPipelineMinimalResponse } from './sftp-pipeline-minimal-response.js';
import type { SDMPipelineMinimalResponse } from './sdm-pipeline-minimal-response.js';
import type { WorkZonePipelineMinimalResponse } from './work-zone-pipeline-minimal-response.js';
/**
 * Representation of the 'PipelineMinimalResponse' schema.
 */
export type PipelineMinimalResponse =
  | ({ type: 'MSSharePoint' } & MSSharePointPipelineMinimalResponse)
  | ({ type: 'S3' } & S3PipelineMinimalResponse)
  | ({ type: 'SFTP' } & SFTPPipelineMinimalResponse)
  | ({ type: 'SDM' } & SDMPipelineMinimalResponse)
  | ({ type: 'WorkZone' } & WorkZonePipelineMinimalResponse);
