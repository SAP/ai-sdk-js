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
 * ReturnUnifiedAiAgentService_Histories_Downvote
 */
export interface ReturnUnifiedAiAgentService_Histories_Downvote<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> {}

/**
 * ReturnUnifiedAiAgentService_Histories_DownvoteField
 * @typeParam EntityT - Type of the entity the complex type field belongs to.
 */
export class ReturnUnifiedAiAgentService_Histories_DownvoteField<
  EntityT extends Entity,
  DeSerializersT extends DeSerializers = DefaultDeSerializers,
  NullableT extends boolean = false,
  SelectableT extends boolean = false
> extends ComplexTypeField<
  EntityT,
  DeSerializersT,
  ReturnUnifiedAiAgentService_Histories_Downvote,
  NullableT,
  SelectableT
> {
  private _fieldBuilder: FieldBuilder<this, DeSerializersT> = new FieldBuilder(
    this,
    this.deSerializers
  );

  /**
   * Creates an instance of ReturnUnifiedAiAgentService_Histories_DownvoteField.
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
      ReturnUnifiedAiAgentService_Histories_Downvote,
      fieldOptions
    );
  }
}

export namespace ReturnUnifiedAiAgentService_Histories_Downvote {
  /**
   * Metadata information on all properties of the `ReturnUnifiedAiAgentService_Histories_Downvote` complex type.
   */
  export const _propertyMetadata: PropertyMetadata<ReturnUnifiedAiAgentService_Histories_Downvote>[] =
    [];
}
