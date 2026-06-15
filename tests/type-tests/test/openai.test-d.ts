import { expectType, expectAssignable, expectError } from 'tsd';
import { SapOpenAi, createOpenAiConfig, createTokenProvider } from '@sap-ai-sdk/openai';
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

/**
 * Direct construction must not be allowed — use SapOpenAi.createClient.
 */

/**
 * SapCompletions.create rejects the model field.
 */
expectError(
  client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello' }]
  })
);

/**
 * SapEmbeddings.create rejects the model field.
 */
expectError(
  client.embeddings.create({ model: 'text-embedding-3-small', input: 'hello' })
);

/**
 * SapResponses.create rejects the model field.
 */
expectError(client.responses.create({ model: 'gpt-4', input: 'Hello' }));

/**
 * CreateOpenAiConfig returns a Promise resolving to an Azure client options object.
 */
expectAssignable<Promise<object>>(createOpenAiConfig('gpt-4.1'));

expectAssignable<Promise<object>>(
  createOpenAiConfig({ deployment: 'gpt-4.1' })
);

/**
 * CreateTokenProvider returns a function that resolves to a string.
 */
expectType<() => Promise<string>>(createTokenProvider());

expectType<() => Promise<string>>(
  createTokenProvider({ url: 'https://example.com' })
);

/**
 * SapModelName is assignable from known model names.
 */
expectAssignable<SapModelName>('gpt-4.1');
expectAssignable<SapModelName>('text-embedding-3-small');

/**
 * SapOpenAiInput accepts a plain string or SapOpenAiOptions.
 */
expectAssignable<SapOpenAiInput>('gpt-4.1');
expectAssignable<SapOpenAiInput>({ deployment: 'gpt-4.1' } satisfies SapOpenAiOptions);
