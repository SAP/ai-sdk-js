/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
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
 * AgentResponseTrace_TokenConsumption
 */
export interface AgentResponseTrace_TokenConsumption<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> {
  /**
   * Id.
   */
  id: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Model Name.
   * @nullable
   */
  modelName?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Input Tokens.
   * @nullable
   */
  inputTokens?: DeserializedType<DeSerializersT, 'Edm.Int32'>;
  /**
   * Output Tokens.
   * @nullable
   */
  outputTokens?: DeserializedType<DeSerializersT, 'Edm.Int32'>;
}

/**
 * AgentResponseTrace_TokenConsumptionField
 * @typeParam EntityT - Type of the entity the complex type field belongs to.
 */
export class AgentResponseTrace_TokenConsumptionField<
  EntityT extends Entity,
  DeSerializersT extends DeSerializers = DefaultDeSerializers,
  NullableT extends boolean = false,
  SelectableT extends boolean = false
> extends ComplexTypeField<
  EntityT,
  DeSerializersT,
  AgentResponseTrace_TokenConsumption,
  NullableT,
  SelectableT
> {
  private _fieldBuilder: FieldBuilder<this, DeSerializersT> = new FieldBuilder(
    this,
    this.deSerializers
  );
  /**
   * Representation of the {@link AgentResponseTrace_TokenConsumption.id} property for query construction.
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
   * Representation of the {@link AgentResponseTrace_TokenConsumption.modelName} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  modelName: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('modelName', 'Edm.String', true);
  /**
   * Representation of the {@link AgentResponseTrace_TokenConsumption.inputTokens} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  inputTokens: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.Int32',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('inputTokens', 'Edm.Int32', true);
  /**
   * Representation of the {@link AgentResponseTrace_TokenConsumption.outputTokens} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  outputTokens: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.Int32',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('outputTokens', 'Edm.Int32', true);

  /**
   * Creates an instance of AgentResponseTrace_TokenConsumptionField.
   * @param fieldName - Actual name of the field as used in the OData request.
   * @param fieldOf - Either the parent entity constructor of the parent complex type this field belongs to.
   */
  constructor(
    fieldName: string,
    fieldOf: ConstructorOrField<EntityT>,
    deSerializers: DeSerializersT,
    fieldOptions?: FieldOptions<NullableT, SelectableT>
  ) {
    super(
      fieldName,
      fieldOf,
      deSerializers,
      AgentResponseTrace_TokenConsumption,
      fieldOptions
    );
  }
}

export namespace AgentResponseTrace_TokenConsumption {
  /**
   * Metadata information on all properties of the `AgentResponseTrace_TokenConsumption` complex type.
   */
  export const _propertyMetadata: PropertyMetadata<AgentResponseTrace_TokenConsumption>[] =
    [
      {
        originalName: 'ID',
        name: 'id',
        type: 'Edm.String',
        isCollection: false
      },
      {
        originalName: 'modelName',
        name: 'modelName',
        type: 'Edm.String',
        isCollection: false
      },
      {
        originalName: 'inputTokens',
        name: 'inputTokens',
        type: 'Edm.Int32',
        isCollection: false
      },
      {
        originalName: 'outputTokens',
        name: 'outputTokens',
        type: 'Edm.Int32',
        isCollection: false
      }
    ];
}
