/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  Entity,
  DefaultDeSerializers,
  DeSerializers,
  DeserializedType
} from '@sap-cloud-sdk/odata-v4';
import type { AiModelsApi } from './AiModelsApi.js';

/**
 * This class represents the entity "AiModels" of service "UnifiedAiAgentService".
 */
export class AiModels<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements AiModelsType<T>
{
  /**
   * Technical entity name for AiModels.
   */
  static override _entityName = 'AiModels';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/';
  /**
   * All key fields of the AiModels entity.
   */
  static _keys = ['modelId'];
  /**
   * Model Id.
   */
  declare modelId: DeserializedType<T, 'Edm.String'>;
  /**
   * Model Name.
   */
  declare modelName: DeserializedType<T, 'Edm.String'>;
  /**
   * Provider Id.
   */
  declare providerId: DeserializedType<T, 'Edm.String'>;
  /**
   * Provider Name.
   */
  declare providerName: DeserializedType<T, 'Edm.String'>;
  /**
   * Rank.
   * @nullable
   */
  declare rank?: DeserializedType<T, 'Edm.Int32'> | null;

  constructor(_entityApi: AiModelsApi<T>) {
    super(_entityApi);
  }
}

export interface AiModelsType<T extends DeSerializers = DefaultDeSerializers> {
  modelId: DeserializedType<T, 'Edm.String'>;
  modelName: DeserializedType<T, 'Edm.String'>;
  providerId: DeserializedType<T, 'Edm.String'>;
  providerName: DeserializedType<T, 'Edm.String'>;
  rank?: DeserializedType<T, 'Edm.Int32'> | null;
}
