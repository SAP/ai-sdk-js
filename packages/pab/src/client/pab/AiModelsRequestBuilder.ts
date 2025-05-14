/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  CreateRequestBuilder,
  DeSerializers,
  DefaultDeSerializers,
  DeleteRequestBuilder,
  DeserializedType,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  RequestBuilder,
  UpdateRequestBuilder
} from '@sap-cloud-sdk/odata-v4';
import { AiModels } from './AiModels.js';

/**
 * Request builder class for operations supported on the {@link AiModels} entity.
 */
export class AiModelsRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<AiModels<T>, T> {
  /**
   * Returns a request builder for querying all `AiModels` entities.
   * @returns A request builder for creating requests to retrieve all `AiModels` entities.
   */
  getAll(): GetAllRequestBuilder<AiModels<T>, T> {
    return new GetAllRequestBuilder<AiModels<T>, T>(this.entityApi);
  }

  /**
   * Returns a request builder for creating a `AiModels` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `AiModels`.
   */
  create(entity: AiModels<T>): CreateRequestBuilder<AiModels<T>, T> {
    return new CreateRequestBuilder<AiModels<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for retrieving one `AiModels` entity based on its keys.
   * @param modelId Key property. See {@link AiModels.modelId}.
   * @returns A request builder for creating requests to retrieve one `AiModels` entity based on its keys.
   */
  getByKey(
    modelId: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<AiModels<T>, T> {
    return new GetByKeyRequestBuilder<AiModels<T>, T>(this.entityApi, {
      modelId: modelId
    });
  }

  /**
   * Returns a request builder for updating an entity of type `AiModels`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `AiModels`.
   */
  update(entity: AiModels<T>): UpdateRequestBuilder<AiModels<T>, T> {
    return new UpdateRequestBuilder<AiModels<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for deleting an entity of type `AiModels`.
   * @param modelId Key property. See {@link AiModels.modelId}.
   * @returns A request builder for creating requests that delete an entity of type `AiModels`.
   */
  delete(modelId: string): DeleteRequestBuilder<AiModels<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `AiModels`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `AiModels` by taking the entity as a parameter.
   */
  delete(entity: AiModels<T>): DeleteRequestBuilder<AiModels<T>, T>;
  delete(modelIdOrEntity: any): DeleteRequestBuilder<AiModels<T>, T> {
    return new DeleteRequestBuilder<AiModels<T>, T>(
      this.entityApi,
      modelIdOrEntity instanceof AiModels
        ? modelIdOrEntity
        : { modelId: modelIdOrEntity! }
    );
  }
}
