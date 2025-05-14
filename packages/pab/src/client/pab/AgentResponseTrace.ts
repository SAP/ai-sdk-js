/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { AgentResponseTrace_TokenConsumption } from './AgentResponseTrace_TokenConsumption.js';
import {
  CollectionField,
  ComplexTypeField,
  ConstructorOrField,
  DeSerializers,
  DefaultDeSerializers,
  DeserializedType,
  EdmTypeField,
  Entity,
  EnumField,
  FieldBuilder,
  FieldOptions,
  OrderableEdmTypeField,
  PropertyMetadata
} from '@sap-cloud-sdk/odata-v4';

/**
 * AgentResponseTrace
 */
export interface AgentResponseTrace<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> {
  /**
   * Id.
   */
  id: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Type.
   */
  type: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Index.
   */
  index: DeserializedType<DeSerializersT, 'Edm.Int32'>;
  /**
   * From Id.
   * @nullable
   */
  fromId?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * To Id.
   * @nullable
   */
  toId?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Data.
   * @nullable
   */
  data?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Token Consumption.
   * @nullable
   */
  tokenConsumption?: DeserializedType<
    DeSerializersT,
    'UnifiedAiAgentService.AgentResponse_trace_tokenConsumption'
  >;
}

/**
 * AgentResponseTraceField
 * @typeParam EntityT - Type of the entity the complex type field belongs to.
 */
export class AgentResponseTraceField<
  EntityT extends Entity,
  DeSerializersT extends DeSerializers = DefaultDeSerializers,
  NullableT extends boolean = false,
  SelectableT extends boolean = false
> extends ComplexTypeField<
  EntityT,
  DeSerializersT,
  AgentResponseTrace,
  NullableT,
  SelectableT
> {
  private _fieldBuilder: FieldBuilder<this, DeSerializersT> = new FieldBuilder(
    this,
    this.deSerializers
  );
  /**
   * Representation of the {@link AgentResponseTrace.id} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  id: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    false,
    false
  > = this._fieldBuilder.buildEdmTypeField('ID', 'Edm.String', false);
  /**
   * Representation of the {@link AgentResponseTrace.type} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  type: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    false,
    false
  > = this._fieldBuilder.buildEdmTypeField('type', 'Edm.String', false);
  /**
   * Representation of the {@link AgentResponseTrace.index} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  index: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.Int32',
    false,
    false
  > = this._fieldBuilder.buildEdmTypeField('index', 'Edm.Int32', false);
  /**
   * Representation of the {@link AgentResponseTrace.fromId} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  fromId: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('fromId', 'Edm.String', true);
  /**
   * Representation of the {@link AgentResponseTrace.toId} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  toId: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('toId', 'Edm.String', true);
  /**
   * Representation of the {@link AgentResponseTrace.data} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  data: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('data', 'Edm.String', true);
  /**
   * Representation of the {@link AgentResponseTrace.tokenConsumption} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  tokenConsumption: CollectionField<
    EntityT,
    DeSerializersT,
    AgentResponseTrace_TokenConsumption,
    true,
    false
  > = this._fieldBuilder.buildCollectionField(
    'tokenConsumption',
    AgentResponseTrace_TokenConsumption,
    true
  );

  /**
   * Creates an instance of AgentResponseTraceField.
   * @param fieldName - Actual name of the field as used in the OData request.
   * @param fieldOf - Either the parent entity constructor of the parent complex type this field belongs to.
   */
  constructor(
    fieldName: string,
    fieldOf: ConstructorOrField<EntityT>,
    deSerializers: DeSerializersT,
    fieldOptions?: FieldOptions<NullableT, SelectableT>
  ) {
    super(fieldName, fieldOf, deSerializers, AgentResponseTrace, fieldOptions);
  }
}

export namespace AgentResponseTrace {
  /**
   * Metadata information on all properties of the `AgentResponseTrace` complex type.
   */
  export const _propertyMetadata: PropertyMetadata<AgentResponseTrace>[] = [
    {
      originalName: 'ID',
      name: 'id',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'type',
      name: 'type',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'index',
      name: 'index',
      type: 'Edm.Int32',
      isCollection: false
    },
    {
      originalName: 'fromId',
      name: 'fromId',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'toId',
      name: 'toId',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'data',
      name: 'data',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'tokenConsumption',
      name: 'tokenConsumption',
      type: AgentResponseTrace_TokenConsumption,
      isCollection: true
    }
  ];
}
