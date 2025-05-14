/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { AgentResponseMissingInputs } from './AgentResponseMissingInputs.js';
import { AgentResponseTrace } from './AgentResponseTrace.js';
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
 * AgentResponse
 */
export interface AgentResponse<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> {
  /**
   * Response.
   * @nullable
   */
  response?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Response Type.
   * @nullable
   */
  responseType?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Missing Inputs.
   * @nullable
   */
  missingInputs?: DeserializedType<
    DeSerializersT,
    'UnifiedAiAgentService.AgentResponse_missingInputs'
  >;
  /**
   * History Id.
   */
  historyId: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Response History Id.
   * @nullable
   */
  responseHistoryId?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Trace.
   * @nullable
   */
  trace?: DeserializedType<
    DeSerializersT,
    'UnifiedAiAgentService.AgentResponse_trace'
  >;
}

/**
 * AgentResponseField
 * @typeParam EntityT - Type of the entity the complex type field belongs to.
 */
export class AgentResponseField<
  EntityT extends Entity,
  DeSerializersT extends DeSerializers = DefaultDeSerializers,
  NullableT extends boolean = false,
  SelectableT extends boolean = false
> extends ComplexTypeField<
  EntityT,
  DeSerializersT,
  AgentResponse,
  NullableT,
  SelectableT
> {
  private _fieldBuilder: FieldBuilder<this, DeSerializersT> = new FieldBuilder(
    this,
    this.deSerializers
  );
  /**
   * Representation of the {@link AgentResponse.response} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  response: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('response', 'Edm.String', true);
  /**
   * Representation of the {@link AgentResponse.responseType} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  responseType: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('responseType', 'Edm.String', true);
  /**
   * Representation of the {@link AgentResponse.missingInputs} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  missingInputs: CollectionField<
    EntityT,
    DeSerializersT,
    AgentResponseMissingInputs,
    true,
    false
  > = this._fieldBuilder.buildCollectionField(
    'missingInputs',
    AgentResponseMissingInputs,
    true
  );
  /**
   * Representation of the {@link AgentResponse.historyId} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  historyId: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    false,
    false
  > = this._fieldBuilder.buildEdmTypeField('historyId', 'Edm.String', false);
  /**
   * Representation of the {@link AgentResponse.responseHistoryId} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  responseHistoryId: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField(
    'responseHistoryId',
    'Edm.String',
    true
  );
  /**
   * Representation of the {@link AgentResponse.trace} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  trace: CollectionField<
    EntityT,
    DeSerializersT,
    AgentResponseTrace,
    true,
    false
  > = this._fieldBuilder.buildCollectionField(
    'trace',
    AgentResponseTrace,
    true
  );

  /**
   * Creates an instance of AgentResponseField.
   * @param fieldName - Actual name of the field as used in the OData request.
   * @param fieldOf - Either the parent entity constructor of the parent complex type this field belongs to.
   */
  constructor(
    fieldName: string,
    fieldOf: ConstructorOrField<EntityT>,
    deSerializers: DeSerializersT,
    fieldOptions?: FieldOptions<NullableT, SelectableT>
  ) {
    super(fieldName, fieldOf, deSerializers, AgentResponse, fieldOptions);
  }
}

export namespace AgentResponse {
  /**
   * Metadata information on all properties of the `AgentResponse` complex type.
   */
  export const _propertyMetadata: PropertyMetadata<AgentResponse>[] = [
    {
      originalName: 'response',
      name: 'response',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'responseType',
      name: 'responseType',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'missingInputs',
      name: 'missingInputs',
      type: AgentResponseMissingInputs,
      isCollection: true
    },
    {
      originalName: 'historyId',
      name: 'historyId',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'responseHistoryId',
      name: 'responseHistoryId',
      type: 'Edm.String',
      isCollection: false
    },
    {
      originalName: 'trace',
      name: 'trace',
      type: AgentResponseTrace,
      isCollection: true
    }
  ];
}
