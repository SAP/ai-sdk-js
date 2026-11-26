import {
  createChatOpenAi,
  createLangChainOpenAiConfig
} from '@sap-ai-sdk/langchain/openai';

import { expectAssignable, expectError, expectType } from 'tsd';

const model = await createChatOpenAi('gpt-5.4', {
  useResponsesApi: true,
  reasoning: { effort: 'low' },
  maxTokens: 1000
});
expectType<string>(model.model);
expectType<boolean>(model.useResponsesApi);
expectAssignable<Promise<unknown>>(model.invoke('Hello!'));

await createChatOpenAi({
  deployment: { deploymentId: 'deployment-id', resourceGroup: 'custom-rg' },
  apiVersion: '2025-01-01',
  clientType: 'my-app'
});

const config = await createLangChainOpenAiConfig('text-embedding-3-small');
expectType<string | null | undefined>(config.baseURL);
expectAssignable<Record<string, unknown> | null | undefined>(
  config.defaultQuery
);

expectError(createChatOpenAi('gpt-5.4', { configuration: {} }));
expectError(createChatOpenAi('gpt-5.4', { model: 'gpt-5.4-nano' }));
expectError(createChatOpenAi('gpt-5.4', { modelName: 'gpt-5.4-nano' }));
