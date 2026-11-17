import {
  getResourceGroup,
  resolveDeploymentUrlForModel
} from '@sap-ai-sdk/ai-api/internal.js';
import { getAiCoreDestination } from '@sap-ai-sdk/core';

import { AzureChatOpenAI } from '@langchain/openai';

import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import type { AIMessageChunk } from '@langchain/core/messages';
import type { ChatOpenAICallOptions, ClientOptions } from '@langchain/openai';

const defaultApiVersion = '2024-10-21';

type LcAzureOpenAiFields = NonNullable<
  ConstructorParameters<typeof AzureChatOpenAI>[0]
>;

/**
 * Options for creating a LangChain Azure OpenAI client for SAP AI Core.
 */
export interface LcAzureOpenAiOptions {
  /**
   * The deployment to use. A model name, model configuration, or deployment ID
   * can be supplied. The deployment URL is resolved before the client is
   * created.
   */
  deployment: ModelDeployment<string>;
  /**
   * Model name sent to LangChain. It is optional because AI Core routes the
   * request using the resolved deployment URL. It is required when
   * `deployment` contains only a deployment ID.
   */
  model?: string;
  /** The destination used to access AI Core. */
  destination?: HttpDestinationOrFetchOptions;
  /** Additional value appended to the `ai-client-type` header. */
  clientType?: string;
  /** Azure OpenAI API version. */
  apiVersion?: string;
  /** Options passed to the LangChain Azure OpenAI model. */
  langChainConfig?: LcAzureOpenAiFields;
}

/**
 * A LangChain Azure OpenAI model configured for SAP AI Core deployments.
 *
 * This class is based on {@link AzureChatOpenAI} from `@langchain/openai`. Use
 * {@link LcAzureOpenAi.createClient} to resolve an AI Core deployment and
 * create an instance.
 */
export class LcAzureOpenAi extends AzureChatOpenAI {
  /** The deployment configuration supplied when the client was created. */
  readonly deployment: ModelDeployment<string>;
  /** The destination used for deployment resolution and authentication. */
  readonly destination?: HttpDestinationOrFetchOptions;
  /** The resolved AI Core resource group. */
  readonly resourceGroup: string;

  /**
   * Keep the chat-model output type explicit for downstream TypeScript users.
   * @param input - The prompt or messages to invoke.
   * @param options - Runtime LangChain call options.
   * @returns The generated AI message chunk.
   */
  override invoke(
    input: BaseLanguageModelInput,
    options?: Partial<ChatOpenAICallOptions>
  ): Promise<AIMessageChunk> {
    return super.invoke(input, options);
  }

  private constructor(
    fields: LcAzureOpenAiFields,
    deployment: ModelDeployment<string>,
    destination: HttpDestinationOrFetchOptions | undefined,
    resourceGroup: string
  ) {
    super(fields);
    this.deployment = deployment;
    this.destination = destination;
    this.resourceGroup = resourceGroup;
  }

  /**
   * Resolve an AI Core deployment and create a ready-to-use LangChain model.
   *
   * @param options - Deployment and LangChain model configuration.
   * @returns A configured LangChain Azure OpenAI model.
   */
  static async createClient(
    options: LcAzureOpenAiOptions
  ): Promise<LcAzureOpenAi> {
    const resourceGroup = getResourceGroup(options.deployment) ?? 'default';
    const deploymentUrl = await resolveDeploymentUrlForModel(
      options.deployment,
      {
        scenarioId: 'foundation-models',
        executableId: 'azure-openai',
        resourceGroup,
        destination: options.destination
      }
    );

    const langChainConfig = options.langChainConfig ?? {};
    const { configuration, ...modelConfig } = langChainConfig;
    const clientType = ['AI SDK JavaScript', options.clientType]
      .filter(Boolean)
      .join(',');
    const azureEndpoint = splitDeploymentUrl(deploymentUrl);

    return new LcAzureOpenAi(
      {
        ...modelConfig,
        model: options.model ?? getModelName(options.deployment),
        azureOpenAIApiVersion: options.apiVersion ?? defaultApiVersion,
        azureOpenAIBasePath: azureEndpoint.basePath,
        azureOpenAIApiDeploymentName: azureEndpoint.deploymentName,
        azureADTokenProvider: createTokenProvider(options.destination),
        configuration: {
          ...configuration,
          defaultHeaders: {
            ...toHeaderRecord(configuration?.defaultHeaders),
            'ai-resource-group': resourceGroup,
            'ai-client-type': clientType
          }
        }
      },
      options.deployment,
      options.destination,
      resourceGroup
    );
  }
}

function splitDeploymentUrl(deploymentUrl: string): {
  basePath: string;
  deploymentName: string;
} {
  const url = new URL(deploymentUrl);
  while (url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }

  const deploymentName = url.pathname.split('/').filter(Boolean).at(-1);
  if (!deploymentName) {
    throw new Error(
      `Deployment URL '${deploymentUrl}' must end with a deployment ID.`
    );
  }

  // URL resolution handles the parent path, origin, and URL escaping for us.
  // The relative URL is guaranteed to end in `/`, which AzureOpenAI expects us
  // to remove before appending the deployment name again.
  const baseUrl = new URL('./', url);
  return {
    basePath: baseUrl.href.slice(0, -1),
    deploymentName
  };
}

/** Convenience factory matching the package-level client naming. */
export const createLcAzureOpenAi =
  LcAzureOpenAi.createClient.bind(LcAzureOpenAi);

function getModelName(deployment: ModelDeployment<string>): string {
  if (typeof deployment === 'string') {
    return deployment;
  }
  if ('modelName' in deployment) {
    return deployment.modelName;
  }
  throw new Error(
    'model is required when deployment is identified by deploymentId.'
  );
}

function createTokenProvider(
  destination?: HttpDestinationOrFetchOptions
): () => Promise<string> {
  return async () => {
    const resolvedDestination = await getAiCoreDestination(destination);
    const authToken = resolvedDestination.authTokens?.[0];
    if (!authToken?.value || authToken.error) {
      throw new Error(
        'Could not retrieve an authentication token from the AI Core destination.'
      );
    }
    return authToken.value;
  };
}

function toHeaderRecord(
  headers: ClientOptions['defaultHeaders']
): Record<string, string> {
  if (!headers) {
    return {};
  }
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  const record: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string') {
      record[key] = value;
    }
  }
  return record;
}
