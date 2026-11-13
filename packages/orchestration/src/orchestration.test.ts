import { createLogger } from '@sap-cloud-sdk/util';

import nock from 'nock';

import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseFileToString,
  parseMockResponse
} from '../../../test-util/mock-http.ts';
import { OrchestrationResponse } from './orchestration-response.ts';
import { OrchestrationStreamResponse } from './orchestration-stream-response.ts';
import { Orchestration } from './orchestration.ts';
import {
  constructCompletionPostRequestFromJsonModuleConfig,
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

const defaultJsonConfig = `{
  "module_configurations": {
    "prompt_templating": {
      "model": {
        "name": "gpt-5.4-nano",
        "params": {
          "max_tokens": 50
        }
      },
      "prompt": {
        "template": [{ "role": "user", "content": "What is the capital of France?" }]
      }
    }
  }
}`;

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

  it('sends an inline-config request via config().create({ prompt })', async () => {
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
      .config(config)
      .create({ prompt });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('streams an inline-config request via config().create({ prompt, stream: true })', async () => {
    mockInference(
      {
        data: constructCompletionPostRequest(config, { messages: prompt }, true)
      },
      { data: streamMockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration()
      .config(config)
      .create({ prompt, stream: true });

    expect(response).toBeInstanceOf(OrchestrationStreamResponse);
  });

  it('sends a config-list request via config().create()', async () => {
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

    const response = await new Orchestration()
      .config([primaryConfig, fallbackConfig])
      .create();

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('sends a config-ref request via config().create()', async () => {
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

    const response = await new Orchestration()
      .config(configRef)
      .create({ placeholderValues: { input: 'Paris' } });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('sends an inline-template request via config().create()', async () => {
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
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest(inlineTemplateConfig, {
          placeholderValues: { input: 'France' }
        })
      },
      { data: mockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration()
      .config(inlineTemplateConfig)
      .create({ placeholderValues: { input: 'France' } });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('sends a template-ref request via config().create()', async () => {
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
      .config(templateRefConfig)
      .create({ placeholderValues: { input: 'Paris' } });

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('sends a JSON-config request via rawConfigJson().create()', async () => {
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequestFromJsonModuleConfig(
          JSON.parse(defaultJsonConfig),
          undefined,
          false
        )
      },
      { data: mockResponse, status: 200 },
      { url: 'inference/deployments/1234/v2/completion' }
    );

    const response = await new Orchestration()
      .rawConfigJson(defaultJsonConfig)
      .create();

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });
});
