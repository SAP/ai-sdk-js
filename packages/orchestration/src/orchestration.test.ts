import { createLogger } from '@sap-cloud-sdk/util';

import nock from 'nock';

import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseFileToString,
  parseMockResponse
} from '../../../test-util/mock-http.ts';
import { Orchestration } from './new/orchestration.ts';
import { OrchestrationResponse } from './orchestration-response.ts';
import { OrchestrationStreamResponse } from './orchestration-stream-response.ts';
import {
  constructCompletionPostRequestFromConfigReference,
  constructCompletionPostRequest
} from './util/index.ts';

import type { CompletionPostResponse } from './client/api/schema/index.ts';
import type {
  OrchestrationModuleConfig,
  OrchestrationConfigWithInlineTemplate,
  OrchestrationConfigWithTemplateRef,
  OrchestrationConfigRef,
  ChatCompletionRequest
} from './orchestration-types.ts';

const streamMockResponse = await parseFileToString(
  'orchestration',
  'orchestration-chat-completion-stream-chunks.txt'
);

createLogger({
  package: 'orchestration',
  messageContext: 'orchestration'
});

describe('Orchestration client fluent builder API', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList({ scenarioId: 'orchestration' }, { id: '1234' });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  const config: OrchestrationModuleConfig = {
    promptTemplating: {
      model: { name: 'gpt-5.4-nano', params: { max_tokens: 50 } }
    }
  };
  const prompt: ChatCompletionRequest['messages'] = [
    { role: 'user', content: 'Hello' }
  ];

  it('sends an inline-config request via completion().create({ prompt })', async () => {
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    // The builder maps `prompt` to the current turn, so the wire body matches the legacy `messages` path.
    mockInference(
      { data: constructCompletionPostRequest(config, { messages: prompt }) },
      { data: mockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration()
      .completion(config)
      .create({ prompt });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('streams an inline-config request via completion().create({ prompt, stream: true })', async () => {
    mockInference(
      {
        data: constructCompletionPostRequest(config, { messages: prompt }, true)
      },
      { data: streamMockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration()
      .completion(config)
      .create({ prompt, stream: true });

    expect(response).toBeInstanceOf(OrchestrationStreamResponse);
  });

  it('sends a template-ref request via completion().create()', async () => {
    const templateRefConfig: OrchestrationConfigWithTemplateRef = {
      promptTemplating: {
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 50 } },
        prompt: { template_ref: { id: 'template-id' } }
      }
    };
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest(templateRefConfig, {
          placeholderValues: { input: 'Paris' }
        })
      },
      { data: mockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration()
      .completion(templateRefConfig)
      .create({ placeholderValues: { input: 'Paris' } });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('sends a merged request via completion.create({ modules, prompt })', async () => {
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    mockInference(
      { data: constructCompletionPostRequest(config, { messages: prompt }) },
      { data: mockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration().completion.create({
      modules: config,
      messages: prompt
    });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('streams a merged inline-template request via completion.create({ modules, stream: true })', async () => {
    const inlineTemplateConfig: OrchestrationConfigWithInlineTemplate = {
      promptTemplating: {
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 50 } },
        prompt: {
          template: [
            { role: 'user', content: 'What is the capital of {{?input}}?' }
          ]
        }
      }
    };
    mockInference(
      {
        data: constructCompletionPostRequest(
          inlineTemplateConfig,
          { placeholderValues: { input: 'France' } },
          true
        )
      },
      { data: streamMockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration().completion.create({
      modules: inlineTemplateConfig,
      placeholderValues: { input: 'France' },
      stream: true
    });

    expect(response).toBeInstanceOf(OrchestrationStreamResponse);
  });

  it('sends a merged fallback-list request via completion.create({ modules })', async () => {
    const fallbackConfig: OrchestrationModuleConfig = {
      promptTemplating: {
        model: { name: 'gpt-5.4', params: { max_tokens: 50 } },
        prompt: { template: [{ role: 'user', content: 'Hello' }] }
      }
    };
    const primaryConfig: OrchestrationModuleConfig = {
      promptTemplating: {
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 50 } },
        prompt: { template: [{ role: 'user', content: 'Hello' }] }
      }
    };
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest([primaryConfig, fallbackConfig])
      },
      { data: mockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration().completion.create({
      modules: [primaryConfig, fallbackConfig]
    });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('sends a merged config-ref request via completion.create({ id })', async () => {
    const configRef: OrchestrationConfigRef = { id: 'config-id' };
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequestFromConfigReference(configRef, {
          placeholderValues: { input: 'Paris' }
        })
      },
      { data: mockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration().completion.create({
      id: 'config-id',
      placeholderValues: { input: 'Paris' }
    });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('sends a request via completion.post() given a JSON string', async () => {
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    const wireBody = constructCompletionPostRequest(config, {
      messages: prompt
    });
    mockInference(
      { data: wireBody },
      { data: mockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration().completion.post(
      JSON.stringify(wireBody)
    );

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('throws when completion.post() is given an invalid JSON string', async () => {
    await expect(
      new Orchestration().completion.post('{ not valid json')
    ).rejects.toThrow(/Could not parse JSON/);
  });
});
