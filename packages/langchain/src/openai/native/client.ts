import { createOpenAiConfig } from '@sap-ai-sdk/openai';

import { ChatOpenAI } from '@langchain/openai';

import type { SapOpenAiInput } from '@sap-ai-sdk/openai';

import type { ChatOpenAIFields, ClientOptions } from '@langchain/openai';

/**
 * Creates an upstream LangChain `ChatOpenAI` model for direct access to OpenAI deployments through SAP AI Core.
 * Supports upstream LangChain features, including the Responses API and tools.
 * The model name is inferred from the deployment; deployment IDs are used as
 * placeholders because SAP AI Core routes requests through the deployment URL.
 * @param options - SAP AI Core deployment options, or a model name as shorthand.
 * @param fields - Additional LangChain model options, excluding connection configuration and model selection.
 * @returns The configured LangChain chat model.
 * @experimental This function is experimental and may change at any time without prior notice.
 * @example
 * ```ts
 * import { createChatOpenAi } from '@sap-ai-sdk/langchain/openai';
 *
 * const model = await createChatOpenAi('gpt-5.4', { useResponsesApi: true });
 * const response = await model.invoke('Hello!');
 * ```
 */
export async function createChatOpenAi(
  options: SapOpenAiInput,
  fields: Omit<ChatOpenAIFields, 'configuration' | 'model' | 'modelName'> = {}
): Promise<ChatOpenAI> {
  const deployment = typeof options === 'string' ? options : options.deployment;
  const model =
    typeof deployment === 'string'
      ? deployment
      : 'modelName' in deployment
        ? deployment.modelName
        : deployment.deploymentId;

  return new ChatOpenAI({
    ...fields,
    model,
    configuration: await createLangChainOpenAiConfig(options)
  });
}

/**
 * Creates configuration for direct access to OpenAI deployments through SAP AI Core using the upstream `@langchain/openai` package.
 * Resolves the deployment URL and configures refreshing bearer authentication,
 * the API version query parameter, and SAP-specific headers.
 * Works with both `ChatOpenAI` and `OpenAIEmbeddings`.
 * @param options - SAP AI Core deployment options, or a model name as shorthand.
 * @returns Client options for the LangChain model's `configuration` field.
 * @experimental This function is experimental and may change at any time without prior notice.
 * @example
 * ```ts
 * import { createLangChainOpenAiConfig } from '@sap-ai-sdk/langchain/openai';
 * import { OpenAIEmbeddings } from '@langchain/openai';
 *
 * const embeddings = new OpenAIEmbeddings({
 *   model: 'text-embedding-3-small',
 *   configuration: await createLangChainOpenAiConfig('text-embedding-3-small')
 * });
 * ```
 */
export async function createLangChainOpenAiConfig(
  options: SapOpenAiInput
): Promise<ClientOptions> {
  const { baseURL, apiVersion, azureADTokenProvider, defaultHeaders } =
    await createOpenAiConfig(options);

  return {
    baseURL,
    apiKey: azureADTokenProvider,
    defaultQuery: { 'api-version': apiVersion },
    defaultHeaders
  };
}
