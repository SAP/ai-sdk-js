/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { AiModels } from './AiModels.js';
import { AiModelsRequestBuilder } from './AiModelsRequestBuilder.js';
import {
  CustomField,
  defaultDeSerializers,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  entityBuilder,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField
} from '@sap-cloud-sdk/odata-v4';
export class AiModelsApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<AiModels<DeSerializersT>, DeSerializersT>
{
  public deSerializers: DeSerializersT;

  private constructor(
    deSerializers: DeSerializersT = defaultDeSerializers as any
  ) {
    this.deSerializers = deSerializers;
  }

  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  public static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(
    deSerializers: DeSerializersT = defaultDeSerializers as any
  ): AiModelsApi<DeSerializersT> {
    return new AiModelsApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = AiModels;

  requestBuilder(): AiModelsRequestBuilder<DeSerializersT> {
    return new AiModelsRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<AiModels<DeSerializersT>, DeSerializersT> {
    return entityBuilder<AiModels<DeSerializersT>, DeSerializersT>(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<AiModels<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof AiModels, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(AiModels, this.deSerializers);
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    MODEL_ID: OrderableEdmTypeField<
      AiModels<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    MODEL_NAME: OrderableEdmTypeField<
      AiModels<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PROVIDER_ID: OrderableEdmTypeField<
      AiModels<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PROVIDER_NAME: OrderableEdmTypeField<
      AiModels<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    RANK: OrderableEdmTypeField<
      AiModels<DeSerializers>,
      DeSerializersT,
      'Edm.Int32',
      true,
      true
    >;
    ALL_FIELDS: AllFields<AiModels<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link modelId} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MODEL_ID: fieldBuilder.buildEdmTypeField(
          'modelId',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link modelName} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MODEL_NAME: fieldBuilder.buildEdmTypeField(
          'modelName',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link providerId} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PROVIDER_ID: fieldBuilder.buildEdmTypeField(
          'providerId',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link providerName} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PROVIDER_NAME: fieldBuilder.buildEdmTypeField(
          'providerName',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link rank} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        RANK: fieldBuilder.buildEdmTypeField('rank', 'Edm.Int32', true),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', AiModels)
      };
    }

    return this._schema;
  }
}
