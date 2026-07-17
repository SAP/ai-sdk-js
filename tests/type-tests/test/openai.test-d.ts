import { expectType, expectAssignable, expectError } from 'tsd';
import {
  SapOpenAi,
  createOpenAiConfig,
  createTokenProvider
} from '@sap-ai-sdk/openai';
import type {
  SapChat,
  SapCompletions,
  SapEmbeddings,
  SapResponses,
  SapOpenAiOptions,
  SapOpenAiInput,
  SapModelName
} from '@sap-ai-sdk/openai';

/**
 * SapOpenAi.createClient returns a Promise<SapOpenAi>.
 */
expectType<Promise<SapOpenAi>>(SapOpenAi.createClient('gpt-4.1'));

expectType<Promise<SapOpenAi>>(
  SapOpenAi.createClient({ deployment: 'gpt-4.1' })
);

expectType<Promise<SapOpenAi>>(
  SapOpenAi.createClient({
    deployment: 'gpt-4.1',
    apiVersion: '2024-10-21',
    clientType: 'my-app'
  })
);

/**
 * SapOpenAi.createClient accepts deployment by ID.
 */
expectType<Promise<SapOpenAi>>(
  SapOpenAi.createClient({ deployment: { deploymentId: 'd123' } })
);

/**
 * SapOpenAi instance exposes chat, embeddings, responses.
 */
declare const client: SapOpenAi;

expectType<SapChat>(client.chat);
expectType<SapEmbeddings>(client.embeddings);
expectType<SapResponses>(client.responses);

/**
 * SapChat exposes completions.
 */
expectType<SapCompletions>(client.chat.completions);

// --- SapCompletions ---

/**
 * SapCompletions.create accepts a model name string.
 */
expectAssignable<Promise<unknown>>(
  client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

/**
 * SapCompletions.create accepts a ModelConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.chat.completions.create({
    model: { modelName: 'gpt-4o', modelVersion: '2024-11-20' },
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

/**
 * SapCompletions.create accepts a DeploymentIdConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.chat.completions.create({
    model: { deploymentId: 'd1234' },
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

/**
 * SapCompletions.create accepts no model (model is optional).
 */
expectAssignable<Promise<unknown>>(
  client.chat.completions.create({
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

/**
 * SapCompletions.parse accepts a model name string.
 */
expectAssignable<Promise<unknown>>(
  client.chat.completions.parse({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

/**
 * SapCompletions.parse accepts a ModelConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.chat.completions.parse({
    model: { modelName: 'gpt-4o', modelVersion: '2024-11-20' },
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

/**
 * SapCompletions.parse accepts a DeploymentIdConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.chat.completions.parse({
    model: { deploymentId: 'd1234' },
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

/**
 * SapCompletions.parse accepts no model (model is optional).
 */
expectAssignable<Promise<unknown>>(
  client.chat.completions.parse({
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

// --- SapEmbeddings ---

/**
 * SapEmbeddings.create accepts a model name string.
 */
expectAssignable<Promise<unknown>>(
  client.embeddings.create({ model: 'text-embedding-3-small', input: 'hello' })
);

/**
 * SapEmbeddings.create accepts a ModelConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.embeddings.create({
    model: { modelName: 'text-embedding-3-small' },
    input: 'hello'
  })
);

/**
 * SapEmbeddings.create accepts a DeploymentIdConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.embeddings.create({
    model: { deploymentId: 'd1234' },
    input: 'hello'
  })
);

/**
 * SapEmbeddings.create accepts no model (model is optional).
 */
expectAssignable<Promise<unknown>>(
  client.embeddings.create({ input: 'hello' })
);

// --- SapResponses ---

/**
 * SapResponses.create accepts a model name string.
 */
expectAssignable<Promise<unknown>>(
  client.responses.create({ model: 'gpt-4o', input: 'Hello' })
);

/**
 * SapResponses.create accepts a ModelConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.responses.create({
    model: { modelName: 'gpt-4o', modelVersion: '2024-11-20' },
    input: 'Hello'
  })
);

/**
 * SapResponses.create accepts a DeploymentIdConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.responses.create({
    model: { deploymentId: 'd1234' },
    input: 'Hello'
  })
);

/**
 * SapResponses.create accepts no model (model is optional).
 */
expectAssignable<Promise<unknown>>(client.responses.create({ input: 'Hello' }));

/**
 * SapResponses.parse accepts a model name string.
 */
expectAssignable<Promise<unknown>>(
  client.responses.parse({ model: 'gpt-4o', input: 'Hello' })
);

/**
 * SapResponses.parse accepts a ModelConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.responses.parse({
    model: { modelName: 'gpt-4o', modelVersion: '2024-11-20' },
    input: 'Hello'
  })
);

/**
 * SapResponses.parse accepts a DeploymentIdConfig object.
 */
expectAssignable<Promise<unknown>>(
  client.responses.parse({
    model: { deploymentId: 'd1234' },
    input: 'Hello'
  })
);

/**
 * SapResponses.parse accepts no model (model is optional).
 */
expectAssignable<Promise<unknown>>(client.responses.parse({ input: 'Hello' }));

/**
 * CreateOpenAiConfig returns a Promise resolving to an Azure client options object.
 * Using a structural subset to avoid importing AzureClientOptions from the openai package.
 */
expectAssignable<
  Promise<{
    baseURL?: string | null;
    apiVersion?: string;
    azureADTokenProvider?: () => Promise<string>;
  }>
>(createOpenAiConfig('gpt-4.1'));

expectAssignable<
  Promise<{
    baseURL?: string | null;
    apiVersion?: string;
    azureADTokenProvider?: () => Promise<string>;
  }>
>(createOpenAiConfig({ deployment: 'gpt-4.1' }));

expectAssignable<
  Promise<{
    baseURL?: string | null;
    apiVersion?: string;
    azureADTokenProvider?: () => Promise<string>;
  }>
>(createOpenAiConfig({ deployment: { deploymentId: 'd123' } }));

/**
 * CreateTokenProvider returns a function that resolves to a string.
 */
expectType<() => Promise<string>>(createTokenProvider());

expectType<() => Promise<string>>(
  createTokenProvider({ url: 'https://example.com' })
);

/**
 * SapModelName is assignable from known model names and any string.
 */
expectAssignable<SapModelName>('gpt-4.1');
expectAssignable<SapModelName>('text-embedding-3-small');
expectAssignable<SapModelName>('unlisted-model');

/**
 * SapOpenAiInput accepts a plain string or SapOpenAiOptions.
 */
expectAssignable<SapOpenAiInput>('gpt-4.1');
expectAssignable<SapOpenAiInput>({
  deployment: 'gpt-4.1'
} satisfies SapOpenAiOptions);

/**
 * SapOpenAiInput rejects objects missing deployment.
 */
expectError(((_: SapOpenAiInput) => {})({ apiVersion: '2024-10-21' }));
