import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import nock from 'nock';

import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseFileToString,
  parseMockResponse
} from '../../../test-util/mock-http.ts';

import { OrchestrationClient } from './orchestration-client.ts';
import {
  constructCompletionPostRequest,
  constructCompletionPostRequestFromConfigReference
} from './util/index.ts';

import type { CompletionPostResponse } from './client/api/schema/index.ts';
import type {
  OrchestrationModuleConfig,
  ChatCompletionRequest
} from './orchestration-types.ts';

// ── Mock @sap-ai-sdk/core tracing helpers ────────────────────────────────────
// We replace withGenAiSpan / startGenAiSpan with lightweight spies that:
//   1. record every call in capturedSpans
//   2. still invoke the user callback so the real HTTP code runs
// executeRequest is kept from the actual module.

type SpanRecord = {
  name: string;
  attributes: Record<string, unknown>;
  updatedAttributes: Record<string, unknown>;
};

let capturedSpans: SpanRecord[] = [];

vi.mock('@sap-ai-sdk/core', async importOriginal => {
  const actual = await importOriginal<typeof import('@sap-ai-sdk/core')>();
  return {
    ...actual,
    withGenAiSpan: vi.fn(
      async (
        name: string,
        attributes: Record<string, unknown>,
        fn: (update: (a: Record<string, unknown>) => void) => Promise<unknown>
      ) => {
        const span: SpanRecord = { name, attributes, updatedAttributes: {} };
        capturedSpans.push(span);
        return fn(attrs => {
          Object.assign(span.updatedAttributes, attrs);
        });
      }
    ),
    startGenAiSpan: vi.fn(
      async (
        name: string,
        attributes: Record<string, unknown>,
        activeCallback: () => Promise<unknown>
      ) => {
        const span: SpanRecord = { name, attributes, updatedAttributes: {} };
        capturedSpans.push(span);
        const result = await activeCallback();
        const update = (attrs: Record<string, unknown>) => {
          Object.assign(span.updatedAttributes, attrs);
        };
        const end = () => {};
        return { result, update, end };
      }
    )
  };
});

// ─────────────────────────────────────────────────────────────────────────────

const modelConfig: OrchestrationModuleConfig = {
  promptTemplating: {
    model: { name: 'gpt-5.4-nano', params: { max_tokens: 50 } }
  }
};

const prompt: ChatCompletionRequest = {
  messages: [{ role: 'user', content: 'What is the capital of France?' }]
};

describe('OrchestrationClient tracing', () => {
  beforeEach(() => {
    capturedSpans = [];
    mockClientCredentialsGrantCall();
    mockDeploymentsList({ scenarioId: 'orchestration' }, { id: '1234' });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('chatCompletion', () => {
    it('creates a gen_ai span with the configured model name', async () => {
      const mockResponse = await parseMockResponse<CompletionPostResponse>(
        'orchestration',
        'orchestration-chat-completion-success-response.json'
      );

      mockInference(
        { data: constructCompletionPostRequest(modelConfig, prompt) },
        { data: mockResponse, status: 200 },
        { url: 'inference/deployments/1234/v2/completion' }
      );

      await new OrchestrationClient(modelConfig).chatCompletion(prompt);

      expect(capturedSpans).toHaveLength(1);
      const span = capturedSpans[0];

      expect(span.name).toBe('chat gpt-5.4-nano');
      expect(span.attributes['gen_ai.system']).toBe('sap-aicore');
      expect(span.attributes['gen_ai.operation.name']).toBe('chat');
      expect(span.attributes['gen_ai.request.model']).toBe('gpt-5.4-nano');
    });

    it('records token usage from the response', async () => {
      const mockResponse = await parseMockResponse<CompletionPostResponse>(
        'orchestration',
        'orchestration-chat-completion-success-response.json'
      );

      mockInference(
        { data: constructCompletionPostRequest(modelConfig, prompt) },
        { data: mockResponse, status: 200 },
        { url: 'inference/deployments/1234/v2/completion' }
      );

      await new OrchestrationClient(modelConfig).chatCompletion(prompt);

      const span = capturedSpans[0];
      expect(span.updatedAttributes['gen_ai.usage.input_tokens']).toEqual(
        expect.any(Number)
      );
      expect(span.updatedAttributes['gen_ai.usage.output_tokens']).toEqual(
        expect.any(Number)
      );
    });

    it('records finish reason and request ID from the response', async () => {
      const mockResponse = await parseMockResponse<CompletionPostResponse>(
        'orchestration',
        'orchestration-chat-completion-success-response.json'
      );

      mockInference(
        { data: constructCompletionPostRequest(modelConfig, prompt) },
        { data: mockResponse, status: 200 },
        { url: 'inference/deployments/1234/v2/completion' }
      );

      await new OrchestrationClient(modelConfig).chatCompletion(prompt);

      const span = capturedSpans[0];
      expect(span.updatedAttributes['gen_ai.response.finish_reasons']).toBe(
        'stop'
      );
      expect(span.updatedAttributes['gen_ai.response.id']).toBe(
        '903367ba-f7b6-42a5-857f-8cff615e201b'
      );
    });

    it('uses "unknown" as model name for config references', async () => {
      const mockResponse = await parseMockResponse<CompletionPostResponse>(
        'orchestration',
        'orchestration-chat-completion-success-response.json'
      );

      const configRef = { id: 'stored-config-id' };
      mockInference(
        {
          data: constructCompletionPostRequestFromConfigReference(
            configRef,
            prompt,
            false
          )
        },
        { data: mockResponse, status: 200 },
        { url: 'inference/deployments/1234/v2/completion' }
      );

      await new OrchestrationClient(configRef).chatCompletion(prompt);

      expect(capturedSpans[0].name).toBe('chat unknown');
      expect(capturedSpans[0].attributes['gen_ai.request.model']).toBe(
        'unknown'
      );
    });
  });

  describe('stream', () => {
    it('creates a gen_ai span that ends after stream is consumed', async () => {
      const streamMockResponse = await parseFileToString(
        'orchestration',
        'orchestration-chat-completion-stream-chunks.txt'
      );

      mockInference(
        { data: constructCompletionPostRequest(modelConfig, prompt, true) },
        { data: streamMockResponse, status: 200 },
        { url: 'inference/deployments/1234/v2/completion' }
      );

      const response = await new OrchestrationClient(modelConfig).stream(
        prompt
      );

      // span is created during the HTTP setup phase
      expect(capturedSpans).toHaveLength(1);
      const span = capturedSpans[0];
      expect(span.name).toBe('chat gpt-5.4-nano');
      expect(span.attributes['gen_ai.system']).toBe('sap-aicore');
      expect(span.attributes['gen_ai.operation.name']).toBe('chat');

      // consume the stream to trigger _onStreamEnd
      for await (const _chunk of response.stream) {
        // intentionally empty
      }

      // token usage should be recorded after stream completion
      expect(span.updatedAttributes['gen_ai.usage.input_tokens']).toEqual(
        expect.any(Number)
      );
      expect(span.updatedAttributes['gen_ai.usage.output_tokens']).toEqual(
        expect.any(Number)
      );
    });
  });
});
