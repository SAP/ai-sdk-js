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
 * AgentResponseMissingInputs
 */
export interface AgentResponseMissingInputs<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> {
  /**
   * Name.
   */
  name: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Description.
   * @nullable
   */
  description?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Type.
   */
  type: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Possible Values.
   * @nullable
   */
  possibleValues?: DeserializedType<DeSerializersT, 'Edm.String'>;
  /**
   * Suggestions.
   * @nullable
   */
  suggestions?: DeserializedType<DeSerializersT, 'Edm.String'>;
}

/**
 * AgentResponseMissingInputsField
 * @typeParam EntityT - Type of the entity the complex type field belongs to.
 */
export class AgentResponseMissingInputsField<
  EntityT extends Entity,
  DeSerializersT extends DeSerializers = DefaultDeSerializers,
  NullableT extends boolean = false,
  SelectableT extends boolean = false
> extends ComplexTypeField<
  EntityT,
  DeSerializersT,
  AgentResponseMissingInputs,
  NullableT,
  SelectableT
> {
  private _fieldBuilder: FieldBuilder<this, DeSerializersT> = new FieldBuilder(
    this,
    this.deSerializers
  );
  /**
   * Representation of the {@link AgentResponseMissingInputs.name} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  name: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    false,
    false
  > = this._fieldBuilder.buildEdmTypeField('name', 'Edm.String', false);
  /**
   * Representation of the {@link AgentResponseMissingInputs.description} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  description: OrderableEdmTypeField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildEdmTypeField('description', 'Edm.String', true);
  /**
   * Representation of the {@link AgentResponseMissingInputs.type} property for query construction.
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
   * Representation of the {@link AgentResponseMissingInputs.possibleValues} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  possibleValues: CollectionField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildCollectionField(
    'possibleValues',
    'Edm.String',
    true
  );
  /**
   * Representation of the {@link AgentResponseMissingInputs.suggestions} property for query construction.
   * Use to reference this property in query operations such as 'filter' in the fluent request API.
   */
  suggestions: CollectionField<
    EntityT,
    DeSerializersT,
    'Edm.String',
    true,
    false
  > = this._fieldBuilder.buildCollectionField(
    'suggestions',
    'Edm.String',
    true
  );

  /**
   * Creates an instance of AgentResponseMissingInputsField.
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
      AgentResponseMissingInputs,
      fieldOptions
    );
  }
}

export namespace AgentResponseMissingInputs {
  /**
   * Metadata information on all properties of the `AgentResponseMissingInputs` complex type.
   */
  export const _propertyMetadata: PropertyMetadata<AgentResponseMissingInputs>[] =
    [
      {
        originalName: 'name',
        name: 'name',
        type: 'Edm.String',
        isCollection: false
      },
      {
        originalName: 'description',
        name: 'description',
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
        originalName: 'possibleValues',
        name: 'possibleValues',
        type: 'Edm.String',
        isCollection: true
      },
      {
        originalName: 'suggestions',
        name: 'suggestions',
        type: 'Edm.String',
        isCollection: true
      }
    ];
}
