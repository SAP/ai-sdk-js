/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiOnYourDataEndpointVectorizationSource } from './on-your-data-endpoint-vectorization-source.js';
import type { AzureOpenAiOnYourDataDeploymentNameVectorizationSource } from './on-your-data-deployment-name-vectorization-source.js';
/**
 * An abstract representation of a vectorization source for Azure OpenAI On Your Data with vector search.
 */
export type AzureOpenAiOnYourDataVectorizationSource =
  | ({ type: 'endpoint' } & AzureOpenAiOnYourDataEndpointVectorizationSource)
  | ({
      type: 'deployment_name';
    } & AzureOpenAiOnYourDataDeploymentNameVectorizationSource);
