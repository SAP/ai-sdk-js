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
 * ReturnUnifiedAiAgentService_Chats_Cancel
 */
export interface ReturnUnifiedAiAgentService_Chats_Cancel<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> {}

/**
 * ReturnUnifiedAiAgentService_Chats_CancelField
 * @typeParam EntityT - Type of the entity the complex type field belongs to.
 */
export class ReturnUnifiedAiAgentService_Chats_CancelField<
  EntityT extends Entity,
  DeSerializersT extends DeSerializers = DefaultDeSerializers,
  NullableT extends boolean = false,
  SelectableT extends boolean = false
> extends ComplexTypeField<
  EntityT,
  DeSerializersT,
  ReturnUnifiedAiAgentService_Chats_Cancel,
  NullableT,
  SelectableT
> {
  private _fieldBuilder: FieldBuilder<this, DeSerializersT> = new FieldBuilder(
    this,
    this.deSerializers
  );

  /**
   * Creates an instance of ReturnUnifiedAiAgentService_Chats_CancelField.
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
      ReturnUnifiedAiAgentService_Chats_Cancel,
      fieldOptions
    );
  }
}

export namespace ReturnUnifiedAiAgentService_Chats_Cancel {
  /**
   * Metadata information on all properties of the `ReturnUnifiedAiAgentService_Chats_Cancel` complex type.
   */
  export const _propertyMetadata: PropertyMetadata<ReturnUnifiedAiAgentService_Chats_Cancel>[] =
    [];
}
