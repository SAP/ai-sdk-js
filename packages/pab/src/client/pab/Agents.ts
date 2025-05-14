/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  Entity,
  DefaultDeSerializers,
  DeSerializers,
  DeserializedType,
  entityDeserializer,
  transformReturnValueForComplexType,
  defaultDeSerializers,
  OperationParameter,
  BoundOperationRequestBuilder
} from '@sap-cloud-sdk/odata-v4';
import { CdsMap, CdsMapField } from './CdsMap.js';
import type { AgentsApi } from './AgentsApi.js';
import { AgentResponse } from './AgentResponse.js';

/**
 * This class represents the entity "Agents" of service "UnifiedAiAgentService".
 */
export class Agents<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements AgentsType<T>
{
  /**
   * Technical entity name for Agents.
   */
  static override _entityName = 'Agents';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/';
  /**
   * All key fields of the Agents entity.
   */
  static _keys = ['ID'];
  /**
   * Id.
   */
  declare id: DeserializedType<T, 'Edm.Guid'>;
  /**
   * Created At.
   * @nullable
   */
  declare createdAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  /**
   * Modified At.
   * @nullable
   */
  declare modifiedAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  /**
   * Name.
   */
  declare name: DeserializedType<T, 'Edm.String'>;
  /**
   * Type.
   * @nullable
   */
  declare type?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Safety Check.
   * @nullable
   */
  declare safetyCheck?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Expert In.
   * @nullable
   */
  declare expertIn?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Initial Instructions.
   * @nullable
   */
  declare initialInstructions?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Iterations.
   * @nullable
   */
  declare iterations?: DeserializedType<T, 'Edm.Int32'> | null;
  /**
   * Mode.
   * @nullable
   */
  declare mode?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Base Model.
   * @nullable
   */
  declare baseModel?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Advanced Model.
   * @nullable
   */
  declare advancedModel?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Preprocessing Enabled.
   * @nullable
   */
  declare preprocessingEnabled?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Postprocessing Enabled.
   * @nullable
   */
  declare postprocessingEnabled?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Default Output Format.
   * @nullable
   */
  declare defaultOutputFormat?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Default Output Format Options.
   * @nullable
   */
  declare defaultOutputFormatOptions?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Orchestration Module Config.
   * @nullable
   */
  declare orchestrationModuleConfig?: CdsMap<T> | null;

  constructor(_entityApi: AgentsApi<T>) {
    super(_entityApi);
  }

  /**
   * Send Message.
   * @param parameters - Object containing all parameters for the action.
   * @returns A request builder that allows to overwrite some of the values and execute the resulting request.
   */
  sendMessage(
    parameters: SendMessageParameters<T>,
    deSerializers: T = defaultDeSerializers as T
  ): BoundOperationRequestBuilder<
    Agents<T>,
    T,
    SendMessageParameters<T>,
    AgentResponse | null
  > {
    const params = {
      msg: new OperationParameter('msg', 'Edm.String', parameters.msg),
      async: new OperationParameter('async', 'Edm.Boolean', parameters.async),
      destination: new OperationParameter(
        'destination',
        'Edm.String',
        parameters.destination
      ),
      outputFormat: new OperationParameter(
        'outputFormat',
        'Edm.String',
        parameters.outputFormat
      ),
      outputFormatOptions: new OperationParameter(
        'outputFormatOptions',
        'Edm.String',
        parameters.outputFormatOptions
      ),
      returnTrace: new OperationParameter(
        'returnTrace',
        'Edm.Boolean',
        parameters.returnTrace
      )
    };

    return new BoundOperationRequestBuilder(
      this._entityApi,
      this,
      'sendMessage',
      data =>
        transformReturnValueForComplexType(data, data =>
          entityDeserializer(
            deSerializers || defaultDeSerializers
          ).deserializeComplexType(data, AgentResponse)
        ),
      params,
      deSerializers,
      'action'
    );
  }
}

export interface AgentsType<T extends DeSerializers = DefaultDeSerializers> {
  id: DeserializedType<T, 'Edm.Guid'>;
  createdAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  modifiedAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  name: DeserializedType<T, 'Edm.String'>;
  type?: DeserializedType<T, 'Edm.String'> | null;
  safetyCheck?: DeserializedType<T, 'Edm.Boolean'> | null;
  expertIn?: DeserializedType<T, 'Edm.String'> | null;
  initialInstructions?: DeserializedType<T, 'Edm.String'> | null;
  iterations?: DeserializedType<T, 'Edm.Int32'> | null;
  mode?: DeserializedType<T, 'Edm.String'> | null;
  baseModel?: DeserializedType<T, 'Edm.String'> | null;
  advancedModel?: DeserializedType<T, 'Edm.String'> | null;
  preprocessingEnabled?: DeserializedType<T, 'Edm.Boolean'> | null;
  postprocessingEnabled?: DeserializedType<T, 'Edm.Boolean'> | null;
  defaultOutputFormat?: DeserializedType<T, 'Edm.String'> | null;
  defaultOutputFormatOptions?: DeserializedType<T, 'Edm.String'> | null;
  orchestrationModuleConfig?: CdsMap<T> | null;
}

/**
 * Type of the parameters to be passed to {@link sendMessage}.
 */
export interface SendMessageParameters<DeSerializersT extends DeSerializers> {
  /**
   * Msg.
   */
  msg: string;
  /**
   * Async.
   */
  async?: boolean | null;
  /**
   * Destination.
   */
  destination?: string | null;
  /**
   * Output Format.
   */
  outputFormat?: string | null;
  /**
   * Output Format Options.
   */
  outputFormatOptions?: string | null;
  /**
   * Return Trace.
   */
  returnTrace?: boolean | null;
}
