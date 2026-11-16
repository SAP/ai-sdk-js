import { SapAnthropicBedrockInvoke } from '@sap-ai-sdk/anthropic';

import { expectType, expectAssignable, expectError } from 'tsd';

import type { SapAnthropicBedrockInvokeConfig } from '@sap-ai-sdk/anthropic';

expectType<SapAnthropicBedrockInvoke>(new SapAnthropicBedrockInvoke());
expectType<SapAnthropicBedrockInvoke>(
  new SapAnthropicBedrockInvoke({
    resourceGroup: 'custom-rg',
    clientType: 'test',
    anthropicConfig: { timeout: 1000, maxRetries: 0 }
  })
);
expectError(
  new SapAnthropicBedrockInvoke({ deployment: { deploymentId: 'd123' } })
);

const client = new SapAnthropicBedrockInvoke();
const params = {
  model: 'anthropic--future-claude',
  max_tokens: 64,
  messages: [{ role: 'user' as const, content: 'hello' }]
};

expectAssignable<Promise<{ content: unknown[] }>>(
  client.messages.create({
    ...params,
    thinking: { type: 'adaptive' },
    cache_control: { type: 'ephemeral' },
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: { type: 'object' } }
    }
  })
);
expectAssignable<Promise<AsyncIterable<unknown>>>(
  client.messages.create({ ...params, stream: true })
);
expectAssignable<{ finalText(): Promise<string> }>(
  client.messages.stream(params)
);
expectAssignable<Promise<{ content: unknown[] }>>(
  client.messages.parse(params)
);
expectAssignable<Promise<{ content: unknown[] }>>(
  client.beta.messages.create(params)
);
expectAssignable<{ finalText(): Promise<string> }>(
  client.beta.messages.stream(params)
);
expectAssignable<AsyncIterable<unknown>>(
  client.beta.messages.toolRunner({ ...params, tools: [] })
);

expectType<SapAnthropicBedrockInvoke>(
  client.withOptions({ timeout: 1000, maxRetries: 0 })
);
expectType<number>(client.timeout);
expectAssignable<SapAnthropicBedrockInvokeConfig>({
  fetch: globalThis.fetch,
  defaultHeaders: { 'custom-header': 'test' }
});

expectError(client.messages.batches);
expectError(client.messages.countTokens);
expectError(client.beta.messages.batches);
expectError(client.beta.messages.countTokens);
expectError(client.beta.files);
expectError(client.beta.models);
expectError(client.beta.skills);
expectError(client.beta.agents);
expectError(client.completions);
expectError(client.baseURL);
expectError(client.apiKey);
expectError(client.awsRegion);

expectError(client.withOptions({ baseURL: 'https://other.example' }));
expectError(client.withOptions({ apiKey: 'test-key' }));
expectError(client.withOptions({ authToken: 'test-token' }));
expectError(client.withOptions({ credentials: null }));
expectError(client.withOptions({ awsAccessKey: 'test-key' }));
expectError(client.withOptions({ awsSecretKey: 'test-key' }));
expectError(client.withOptions({ awsSessionToken: 'test-token' }));
expectError(client.withOptions({ awsRegion: 'us-east-1' }));
expectError(client.withOptions({ skipAuth: true }));
expectError(client.withOptions({ providerChainResolver: null }));
expectError(client.withOptions({ config: null }));
expectError(client.withOptions({ profile: 'test' }));
expectError(client.withOptions({ webhookKey: 'test-key' }));
expectError(
  new SapAnthropicBedrockInvoke({
    anthropicConfig: { baseURL: 'https://other.example' }
  })
);
