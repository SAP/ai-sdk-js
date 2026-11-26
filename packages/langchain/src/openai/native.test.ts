import { registerDestination } from '@sap-cloud-sdk/connectivity';

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import nock from 'nock';

import {
  aiCoreDestination,
  createDestinationTokens,
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference
} from '../../../../test-util/mock-http.ts';
import {
  createChatOpenAi,
  createLangChainOpenAiConfig
} from './native/index.ts';

const deploymentUrl = `${aiCoreDestination.url}/v2/inference/deployments/native-dep`;

function mockModelDeployment(modelName = 'gpt-5.4', resourceGroup = 'default') {
  return mockDeploymentsList(
    {
      scenarioId: 'foundation-models',
      executableId: 'azure-openai',
      resourceGroup
    },
    {
      id: 'native-dep',
      model: { name: modelName, version: 'latest' },
      deploymentUrl
    }
  );
}

describe('native LangChain OpenAI helpers', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('creates native configuration from a model name', async () => {
    mockModelDeployment();

    const config = await createLangChainOpenAiConfig('gpt-5.4');

    expect(config).toEqual({
      baseURL: deploymentUrl,
      apiKey: expect.any(Function),
      defaultQuery: { 'api-version': '2024-10-21' },
      defaultHeaders: {
        'ai-resource-group': 'default',
        'ai-client-type': 'AI SDK JavaScript'
      }
    });
  });

  it('preserves the API version, resource group, and client type', async () => {
    mockModelDeployment('gpt-5.4', 'custom-rg');

    const config = await createLangChainOpenAiConfig({
      deployment: { modelName: 'gpt-5.4', resourceGroup: 'custom-rg' },
      apiVersion: '2025-01-01',
      clientType: 'my-langchain-app'
    });

    expect(config.defaultQuery).toEqual({ 'api-version': '2025-01-01' });
    expect(config.defaultHeaders).toEqual({
      'ai-resource-group': 'custom-rg',
      'ai-client-type': 'AI SDK JavaScript,my-langchain-app'
    });
  });

  it('resolves the token from the supplied destination on each call', async () => {
    const destination = {
      name: 'native-openai-destination',
      url: aiCoreDestination.url,
      ...createDestinationTokens('first-token')
    };
    await registerDestination(destination);
    mockModelDeployment();

    const config = await createLangChainOpenAiConfig({
      deployment: 'gpt-5.4',
      destination: { destinationName: destination.name, useCache: false }
    });

    if (typeof config.apiKey !== 'function') {
      throw new Error('Expected a token provider function.');
    }
    expect(await config.apiKey()).toBe('first-token');

    await registerDestination({
      ...destination,
      ...createDestinationTokens('second-token')
    });
    expect(await config.apiKey()).toBe('second-token');
  });

  it('creates a native ChatOpenAI and preserves model options', async () => {
    mockModelDeployment();

    const model = await createChatOpenAi('gpt-5.4', {
      temperature: 0.2,
      maxTokens: 100,
      useResponsesApi: true
    });

    expect(model).toBeInstanceOf(ChatOpenAI);
    expect(model.model).toBe('gpt-5.4');
    expect(model.temperature).toBe(0.2);
    expect(model.maxTokens).toBe(100);
    expect(model.useResponsesApi).toBe(true);
  });

  it('infers the model name from object deployment options', async () => {
    mockModelDeployment();

    const model = await createChatOpenAi({
      deployment: { modelName: 'gpt-5.4', modelVersion: 'latest' }
    });

    expect(model.model).toBe('gpt-5.4');
  });

  it('accepts a deployment ID without a model name', async () => {
    const scope = nock(aiCoreDestination.url)
      .get('/v2/lm/deployments/native-dep')
      .reply(200, { deploymentUrl });

    const model = await createChatOpenAi({
      deployment: { deploymentId: 'native-dep' }
    });

    expect(model.model).toBe('native-dep');
    expect(scope.isDone()).toBe(true);
  });

  it('sends chat requests with SAP authentication and API-version queries', async () => {
    mockModelDeployment();
    const scope = mockInference(
      body => {
        expect(body.model).toBe('gpt-5.4');
        expect(body.messages).toEqual([{ role: 'user', content: 'Hello!' }]);
        return true;
      },
      {
        status: 200,
        data: {
          id: 'chat-1',
          object: 'chat.completion',
          created: 1,
          model: 'gpt-5.4',
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'Hi!' },
              finish_reason: 'stop'
            }
          ]
        }
      },
      {
        url: 'inference/deployments/native-dep/chat/completions',
        apiVersion: '2024-10-21'
      }
    );

    const model = await createChatOpenAi('gpt-5.4', { maxRetries: 0 });

    expect((await model.invoke('Hello!')).content).toBe('Hi!');
    expect(scope.isDone()).toBe(true);
  });

  it('supports embedding requests with the same configuration helper', async () => {
    mockModelDeployment('text-embedding-3-small');
    const scope = mockInference(
      body => {
        expect(body.model).toBe('text-embedding-3-small');
        return true;
      },
      {
        status: 200,
        data: {
          object: 'list',
          data: [{ object: 'embedding', index: 0, embedding: [0.1, 0.2] }],
          model: 'text-embedding-3-small',
          usage: { prompt_tokens: 1, total_tokens: 1 }
        }
      },
      {
        url: 'inference/deployments/native-dep/embeddings',
        apiVersion: '2024-10-21'
      }
    );
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
      maxRetries: 0,
      configuration: await createLangChainOpenAiConfig('text-embedding-3-small')
    });

    expect(await embeddings.embedQuery('Hello!')).toEqual([0.1, 0.2]);
    expect(scope.isDone()).toBe(true);
  });

  it('sends Responses API requests through the configured deployment', async () => {
    mockModelDeployment();
    let requestBody: Record<string, unknown> = {};
    const scope = mockInference(
      body => {
        requestBody = body;
        return true;
      },
      {
        status: 200,
        data: {
          id: 'response-1',
          object: 'response',
          created_at: 1,
          status: 'completed',
          model: 'gpt-5.4',
          output: [
            {
              id: 'message-1',
              type: 'message',
              role: 'assistant',
              status: 'completed',
              content: [{ type: 'output_text', text: 'Hi!', annotations: [] }]
            }
          ]
        }
      },
      {
        url: 'inference/deployments/native-dep/responses',
        apiVersion: '2024-10-21'
      }
    );
    const model = await createChatOpenAi('gpt-5.4', {
      useResponsesApi: true,
      maxRetries: 0
    });

    expect((await model.invoke('Hello!')).text).toBe('Hi!');
    expect(requestBody.model).toBe('gpt-5.4');
    expect(requestBody.input).toEqual([
      {
        type: 'message',
        role: 'user',
        content: 'Hello!'
      }
    ]);
    expect(scope.isDone()).toBe(true);
  });
});
