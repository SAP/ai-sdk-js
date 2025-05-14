/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Agents } from './Agents.js';
import { AgentsRequestBuilder } from './AgentsRequestBuilder.js';
import { CdsMap, CdsMapField } from './CdsMap.js';
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
export class AgentsApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<Agents<DeSerializersT>, DeSerializersT>
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
  ): AgentsApi<DeSerializersT> {
    return new AgentsApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = Agents;

  requestBuilder(): AgentsRequestBuilder<DeSerializersT> {
    return new AgentsRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<Agents<DeSerializersT>, DeSerializersT> {
    return entityBuilder<Agents<DeSerializersT>, DeSerializersT>(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<Agents<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof Agents, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(Agents, this.deSerializers);
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    ID: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.Guid',
      false,
      true
    >;
    CREATED_AT: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.DateTimeOffset',
      true,
      true
    >;
    MODIFIED_AT: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.DateTimeOffset',
      true,
      true
    >;
    NAME: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    TYPE: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    SAFETY_CHECK: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    EXPERT_IN: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    INITIAL_INSTRUCTIONS: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ITERATIONS: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.Int32',
      true,
      true
    >;
    MODE: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BASE_MODEL: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ADVANCED_MODEL: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PREPROCESSING_ENABLED: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    POSTPROCESSING_ENABLED: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    DEFAULT_OUTPUT_FORMAT: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    DEFAULT_OUTPUT_FORMAT_OPTIONS: OrderableEdmTypeField<
      Agents<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ORCHESTRATION_MODULE_CONFIG: CdsMapField<
      Agents<DeSerializers>,
      DeSerializersT,
      true,
      true
    >;
    ALL_FIELDS: AllFields<Agents<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link id} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ID: fieldBuilder.buildEdmTypeField('ID', 'Edm.Guid', false),
        /**
         * Static representation of the {@link createdAt} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CREATED_AT: fieldBuilder.buildEdmTypeField(
          'createdAt',
          'Edm.DateTimeOffset',
          true,
          7
        ),
        /**
         * Static representation of the {@link modifiedAt} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MODIFIED_AT: fieldBuilder.buildEdmTypeField(
          'modifiedAt',
          'Edm.DateTimeOffset',
          true,
          7
        ),
        /**
         * Static representation of the {@link name} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        NAME: fieldBuilder.buildEdmTypeField('name', 'Edm.String', false),
        /**
         * Static representation of the {@link type} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        TYPE: fieldBuilder.buildEdmTypeField('type', 'Edm.String', true),
        /**
         * Static representation of the {@link safetyCheck} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SAFETY_CHECK: fieldBuilder.buildEdmTypeField(
          'safetyCheck',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link expertIn} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        EXPERT_IN: fieldBuilder.buildEdmTypeField(
          'expertIn',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link initialInstructions} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        INITIAL_INSTRUCTIONS: fieldBuilder.buildEdmTypeField(
          'initialInstructions',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link iterations} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ITERATIONS: fieldBuilder.buildEdmTypeField(
          'iterations',
          'Edm.Int32',
          true
        ),
        /**
         * Static representation of the {@link mode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MODE: fieldBuilder.buildEdmTypeField('mode', 'Edm.String', true),
        /**
         * Static representation of the {@link baseModel} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        BASE_MODEL: fieldBuilder.buildEdmTypeField(
          'baseModel',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link advancedModel} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ADVANCED_MODEL: fieldBuilder.buildEdmTypeField(
          'advancedModel',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link preprocessingEnabled} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PREPROCESSING_ENABLED: fieldBuilder.buildEdmTypeField(
          'preprocessingEnabled',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link postprocessingEnabled} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        POSTPROCESSING_ENABLED: fieldBuilder.buildEdmTypeField(
          'postprocessingEnabled',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link defaultOutputFormat} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DEFAULT_OUTPUT_FORMAT: fieldBuilder.buildEdmTypeField(
          'defaultOutputFormat',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link defaultOutputFormatOptions} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DEFAULT_OUTPUT_FORMAT_OPTIONS: fieldBuilder.buildEdmTypeField(
          'defaultOutputFormatOptions',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link orchestrationModuleConfig} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ORCHESTRATION_MODULE_CONFIG: fieldBuilder.buildComplexTypeField(
          'orchestrationModuleConfig',
          CdsMapField,
          true
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Agents)
      };
    }

    return this._schema;
  }
}
