/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  CreateRequestBuilder,
  DeleteRequestBuilder,
  DeSerializers,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  ODataBatchRequestBuilder,
  UpdateRequestBuilder,
  BatchChangeSet
} from '@sap-cloud-sdk/odata-v4';
import { transformVariadicArgumentToArray } from '@sap-cloud-sdk/util';
import { Agents, AiModels } from './index.js';

/**
 * Batch builder for operations supported on the Pab.
 * @param requests The requests of the batch.
 * @returns A request builder for batch.
 */
export function batch<DeSerializersT extends DeSerializers>(
  ...requests: Array<
    ReadPabRequestBuilder<DeSerializersT> | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT>;
export function batch<DeSerializersT extends DeSerializers>(
  requests: Array<
    ReadPabRequestBuilder<DeSerializersT> | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT>;
export function batch<DeSerializersT extends DeSerializers>(
  first:
    | undefined
    | ReadPabRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
    | Array<
        ReadPabRequestBuilder<DeSerializersT> | BatchChangeSet<DeSerializersT>
      >,
  ...rest: Array<
    ReadPabRequestBuilder<DeSerializersT> | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT> {
  return new ODataBatchRequestBuilder(
    defaultPabPath,
    transformVariadicArgumentToArray(first, rest)
  );
}

/**
 * Change set constructor consists of write operations supported on the Pab.
 * @param requests The requests of the change set.
 * @returns A change set for batch.
 */
export function changeset<DeSerializersT extends DeSerializers>(
  ...requests: Array<WritePabRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT>;
export function changeset<DeSerializersT extends DeSerializers>(
  requests: Array<WritePabRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT>;
export function changeset<DeSerializersT extends DeSerializers>(
  first:
    | undefined
    | WritePabRequestBuilder<DeSerializersT>
    | Array<WritePabRequestBuilder<DeSerializersT>>,
  ...rest: Array<WritePabRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT> {
  return new BatchChangeSet(transformVariadicArgumentToArray(first, rest));
}

export const defaultPabPath = '/';
export type ReadPabRequestBuilder<DeSerializersT extends DeSerializers> =
  | GetAllRequestBuilder<Agents<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<AiModels<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<Agents<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<AiModels<DeSerializersT>, DeSerializersT>;
export type WritePabRequestBuilder<DeSerializersT extends DeSerializers> =
  | CreateRequestBuilder<Agents<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Agents<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Agents<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<AiModels<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<AiModels<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<AiModels<DeSerializersT>, DeSerializersT>;
