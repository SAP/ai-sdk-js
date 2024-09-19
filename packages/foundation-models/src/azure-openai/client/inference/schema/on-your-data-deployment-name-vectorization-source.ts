/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiOnYourDataVectorizationSourceType } from './on-your-data-vectorization-source-type.js';
/**
 * The details of a a vectorization source, used by Azure OpenAI On Your Data when applying vector search, that is based
 * on an internal embeddings model deployment name in the same Azure OpenAI resource.
 */
export type AzureOpenAiOnYourDataDeploymentNameVectorizationSource = {
  type: AzureOpenAiOnYourDataVectorizationSourceType;
} & {
  /**
   * Specifies the name of the model deployment to use for vectorization. This model deployment must be in the same Azure OpenAI resource, but On Your Data will use this model deployment via an internal call rather than a public one, which enables vector search even in private networks.
   */
  deployment_name: string;
} & Record<string, any>;
