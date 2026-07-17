import { expectType, expectAssignable, expectError } from 'tsd';
import { SapOpenAiRealtime } from '@sap-ai-sdk/openai/realtime';
import type { AzureOpenAiRealtimeModel } from '@sap-ai-sdk/core';
import type {
  SapOpenAiRealtimeOptions,
  SapOpenAiRealtimeInput
} from '@sap-ai-sdk/openai/realtime';

/**
 * SapOpenAiRealtime.createClient returns a Promise<SapOpenAiRealtime>.
 */
expectType<Promise<SapOpenAiRealtime>>(
  SapOpenAiRealtime.createClient('gpt-realtime')
);

expectType<Promise<SapOpenAiRealtime>>(
  SapOpenAiRealtime.createClient({ deployment: 'gpt-realtime' })
);

expectType<Promise<SapOpenAiRealtime>>(
  SapOpenAiRealtime.createClient({
    deployment: 'gpt-realtime',
    clientType: 'my-app'
  })
);

/**
 * SapOpenAiRealtime.createClient accepts deployment by ID.
 */
expectType<Promise<SapOpenAiRealtime>>(
  SapOpenAiRealtime.createClient({ deployment: { deploymentId: 'd123' } })
);

/**
 * AzureOpenAiRealtimeModel is assignable from the known model and any string (LiteralUnion),
 * so additional realtime models can be supported without a type change.
 */
expectAssignable<AzureOpenAiRealtimeModel>('gpt-realtime');
expectAssignable<AzureOpenAiRealtimeModel>('future-realtime-model');

/**
 * SapOpenAiRealtimeInput accepts a plain string or SapOpenAiRealtimeOptions.
 */
expectAssignable<SapOpenAiRealtimeInput>('gpt-realtime');
expectAssignable<SapOpenAiRealtimeInput>({
  deployment: 'gpt-realtime'
} satisfies SapOpenAiRealtimeOptions);

/**
 * SapOpenAiRealtimeInput rejects objects missing deployment.
 */
expectError(((_: SapOpenAiRealtimeInput) => {})({ clientType: 'my-app' }));
