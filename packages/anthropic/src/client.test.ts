import { deploymentCache } from '@sap-ai-sdk/ai-api/internal.js';

import { APIError } from '@anthropic-ai/sdk';
import { EventStreamCodec } from '@smithy/core/event-streams';
import nock from 'nock';

import {
  getMockedAiCoreDestination,
  mockClientCredentialsGrantCall,
  mockDeploymentsList
} from '../../../test-util/mock-http.ts';
import { dummyToken } from '../../../test-util/mock-jwt.ts';
import { placeholderBaseUrl } from './bedrock-client.ts';
import { SapAnthropicBedrockInvoke } from './client.ts';

import type {
  SapAnthropicBedrockInvokeConfig,
  SapAnthropicBedrockInvokeOptions
} from './types.ts';
import type { MessageStreamEvent } from '@anthropic-ai/sdk/resources/messages';

const deploymentUrl =
  'https://api.ai.example/v2/inference/deployments/deployment-123';
const model = 'anthropic--claude-4.6-sonnet';
const defaultDeployment = {
  id: 'deployment-123',
  model: { name: model, version: 'latest' },
  deploymentUrl
};
const params = {
  model,
  max_tokens: 32,
  messages: [{ role: 'user' as const, content: 'Hello' }]
};
const message = {
  id: 'msg_123',
  type: 'message' as const,
  role: 'assistant' as const,
  model: 'claude-sonnet-4-6',
  content: [{ type: 'text' as const, text: 'Hello from Claude' }],
  stop_reason: 'end_turn' as const,
  stop_sequence: null,
  usage: { input_tokens: 5, output_tokens: 3 }
};
const events = [
  {
    type: 'message_start',
    message: { ...message, content: [], stop_reason: null }
  },
  {
    type: 'content_block_start',
    index: 0,
    content_block: { type: 'text', text: '' }
  },
  {
    type: 'content_block_delta',
    index: 0,
    delta: { type: 'text_delta', text: 'Hello from Claude' }
  },
  { type: 'content_block_stop', index: 0 },
  {
    type: 'message_delta',
    delta: { stop_reason: 'end_turn', stop_sequence: null },
    usage: { output_tokens: 3 }
  },
  { type: 'message_stop' }
];

function createBinaryResponse(payloads: unknown[]): Response {
  const encoder = new TextEncoder();
  const codec = new EventStreamCodec(
    bytes => new TextDecoder().decode(bytes),
    text => encoder.encode(text)
  );
  const frames = payloads.map(payload =>
    codec.encode({
      headers: {
        ':message-type': { type: 'string', value: 'event' },
        ':event-type': { type: 'string', value: 'chunk' },
        ':content-type': { type: 'string', value: 'application/json' }
      },
      body: encoder.encode(
        JSON.stringify({
          bytes: Buffer.from(JSON.stringify(payload)).toString('base64')
        })
      )
    })
  );

  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        frames.forEach(frame => {
          // Split binary headers and payloads across network chunks.
          for (let offset = 0; offset < frame.length; offset += 17) {
            controller.enqueue(frame.slice(offset, offset + 17));
          }
        });
        controller.close();
      }
    }),
    { headers: { 'content-type': 'application/vnd.amazon.eventstream' } }
  );
}

describe('SapAnthropicBedrockInvoke', () => {
  const fetch = vi.fn<typeof globalThis.fetch>();

  beforeEach(() => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aws-bedrock',
        resourceGroup: 'default'
      },
      defaultDeployment
    );
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aws-bedrock',
        resourceGroup: 'custom-rg'
      },
      defaultDeployment
    );
    fetch.mockReset();
    fetch.mockImplementation(async () => Response.json(message));
  });

  afterEach(() => {
    nock.cleanAll();
    deploymentCache.clear();
  });

  function createClient(
    destination?: SapAnthropicBedrockInvokeOptions['destination']
  ): SapAnthropicBedrockInvoke {
    return new SapAnthropicBedrockInvoke({
      resourceGroup: 'custom-rg',
      destination,
      clientType: 'test-app',
      anthropicConfig: { fetch, maxRetries: 0 }
    });
  }

  it('selects the deployment by model name and version per request', async () => {
    nock.cleanAll();
    mockClientCredentialsGrantCall();
    const otherUrl =
      'https://api.ai.example/v2/inference/deployments/deployment-456';
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aws-bedrock',
        resourceGroup: 'custom-rg'
      },
      defaultDeployment,
      {
        id: 'deployment-456',
        model: { name: model, version: '1' },
        deploymentUrl: otherUrl
      }
    );
    const client = createClient();
    await client.messages.create(params);
    await client.messages.create({ ...params, model: `${model}:1` });
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      `${deploymentUrl}/invoke`,
      `${otherUrl}/invoke`
    ]);
  });

  it('fails before sending inference when no deployment matches the model', async () => {
    const client = createClient();
    await expect(
      client.messages.create({ ...params, model: 'anthropic--unknown' })
    ).rejects.toThrow(
      "No running AWS Bedrock deployment with model name or deployment ID 'anthropic--unknown' found in resource group 'custom-rg'."
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('uses the default resource group and custom destination', async () => {
    const destination = getMockedAiCoreDestination({
      url: 'https://custom.ai.example'
    });
    const scope = nock(destination.url, {
      reqheaders: { 'ai-resource-group': 'default' }
    })
      .get('/v2/lm/deployments')
      .query(true)
      .reply(200, {
        resources: [
          {
            id: defaultDeployment.id,
            deploymentUrl,
            details: {
              resources: { backendDetails: { model: defaultDeployment.model } }
            }
          }
        ]
      });
    const client = new SapAnthropicBedrockInvoke({
      destination,
      anthropicConfig: { fetch, maxRetries: 0 }
    });
    await client.messages.create(params);
    expect(scope.isDone()).toBe(true);
    const [url, init] = fetch.mock.calls[0];
    const request = new Request(url, init);
    expect(request.url).toBe(`${deploymentUrl}/invoke`);
    expect(request.headers.get('ai-resource-group')).toBe('default');
  });

  it('selects the deployment by ID per request from a single cached listing', async () => {
    nock.cleanAll();
    mockClientCredentialsGrantCall();
    const customUrl =
      'https://api.ai.example/v2/inference/deployments/custom-123';
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aws-bedrock',
        resourceGroup: 'custom-rg'
      },
      defaultDeployment,
      {
        id: 'custom-123',
        model: { name: 'custom-claude' },
        deploymentUrl: customUrl
      }
    );
    const client = createClient();
    await client.messages.create({ ...params, model: 'custom-123' });
    await client.messages.create({ ...params, model: 'custom-123' });
    await client.messages.create(params);
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      `${customUrl}/invoke`,
      `${customUrl}/invoke`,
      `${deploymentUrl}/invoke`
    ]);
  });

  it('uses Invoke with upstream payload adaptation and SAP headers', async () => {
    const client = createClient();
    expect(await client.messages.create(params)).toEqual(message);
    const [url, init] = fetch.mock.calls[0];
    const request = new Request(url, init);
    expect(request.url).toBe(`${deploymentUrl}/invoke`);
    expect(await request.json()).toEqual({
      max_tokens: 32,
      messages: params.messages,
      anthropic_version: 'bedrock-2023-05-31'
    });
    expect(request.headers.get('authorization')).toBe(`Bearer ${dummyToken}`);
    expect(request.headers.get('ai-resource-group')).toBe('custom-rg');
    expect(request.headers.get('ai-client-type')).toBe(
      'AI SDK JavaScript,test-app'
    );
    expect(request.headers.has('x-api-key')).toBe(false);
    expect(request.headers.has('x-amz-date')).toBe(false);
  });

  it('resolves destination tokens for every request', async () => {
    const destination = getMockedAiCoreDestination();
    const client = createClient(destination);
    await client.messages.create(params);
    destination.authTokens![0] = {
      ...destination.authTokens![0],
      value: 'refreshed-token',
      http_header: {
        key: 'Authorization',
        value: 'Bearer refreshed-token'
      }
    };
    await client.messages.create(params);
    const [url, init] = fetch.mock.calls[1];
    expect(new Request(url, init).headers.get('authorization')).toBe(
      'Bearer refreshed-token'
    );
  });

  it('decodes fragmented binary streams with native text and message helpers', async () => {
    fetch.mockImplementation(async () => createBinaryResponse(events));
    const client = createClient();
    const stream = client.messages.stream(params);
    const onText = vi.fn<(text: string, snapshot: string) => void>();
    stream.on('text', onText);
    expect(await stream.finalText()).toBe('Hello from Claude');
    expect((await stream.finalMessage()).content).toEqual(message.content);
    expect(onText).toHaveBeenCalledWith(
      'Hello from Claude',
      'Hello from Claude'
    );
    const [url, init] = fetch.mock.calls[0];
    const request = new Request(url, init);
    expect(request.url).toBe(`${deploymentUrl}/invoke-with-response-stream`);
    expect(request.headers.get('accept')).toBe(
      'application/vnd.amazon.eventstream'
    );
  });

  it('preserves raw typed stream iteration', async () => {
    fetch.mockImplementation(async () => createBinaryResponse(events));
    const client = createClient();
    const stream = await client.messages.create({ ...params, stream: true });
    const received: MessageStreamEvent[] = [];
    for await (const event of stream) {
      received.push(event);
    }
    expect(received.map(event => event.type)).toEqual(
      events.map(event => event.type)
    );
  });

  it('preserves SAP context when cloning with upstream options', async () => {
    const client = createClient().withOptions({ timeout: 1000 });
    expect(client.timeout).toBe(1000);
    await client.messages.create(params);
    const [url, init] = fetch.mock.calls[0];
    expect(new Request(url, init).headers.get('ai-resource-group')).toBe(
      'custom-rg'
    );
  });

  it('hides first-party resources and upstream routing options at runtime', async () => {
    const client = createClient();
    expect(Object.keys(client.beta)).toEqual(['messages']);
    expect(client).not.toHaveProperty('completions');
    expect(client).not.toHaveProperty('baseURL');
    expect(client).not.toHaveProperty('apiKey');
    expect(client.messages).not.toHaveProperty('countTokens');
    expect(client.messages).not.toHaveProperty('batches');
    expect(client.beta.messages).not.toHaveProperty('countTokens');
    expect(client.beta.messages).not.toHaveProperty('batches');
    expect(client.beta.messages.toolRunner).toBeTypeOf('function');
  });

  it('ignores runtime routing and auth overrides when cloning', async () => {
    const client = createClient().withOptions({
      timeout: 1000,
      baseURL: 'https://other.example',
      credentials: {},
      awsAccessKey: 'aws-key',
      skipAuth: false
    } as SapAnthropicBedrockInvokeConfig);
    await client.messages.create(params);
    const [url, init] = fetch.mock.calls[0];
    const request = new Request(url, init);
    expect(request.url).toBe(`${deploymentUrl}/invoke`);
    expect(request.headers.get('authorization')).toBe(`Bearer ${dummyToken}`);
    expect(request.headers.has('x-amz-date')).toBe(false);
    expect(client.timeout).toBe(1000);
  });

  it('preserves future model operation suffixes and query parameters', async () => {
    const client = new SapAnthropicBedrockInvoke({
      anthropicConfig: {
        fetch,
        maxRetries: 0,
        middleware: [
          async (request, next) =>
            next({
              ...request,
              url: `${placeholderBaseUrl}/model/${model}/future-operation/nested?option=1`
            })
        ]
      }
    });
    await client.messages.create(params);
    expect(fetch.mock.calls[0][0]).toBe(
      `${deploymentUrl}/future-operation/nested?option=1`
    );
  });

  it('negotiates streaming for future operations using upstream request options', async () => {
    fetch.mockImplementation(async () => createBinaryResponse(events));
    const client = createClient().withOptions({
      middleware: [
        async (middlewareRequest, next) =>
          next({
            ...middlewareRequest,
            url: `${placeholderBaseUrl}/model/${model}/future-operation`
          })
      ]
    });
    expect(await client.messages.stream(params).finalText()).toBe(
      'Hello from Claude'
    );
    const [url, init] = fetch.mock.calls[0];
    const request = new Request(url, init);
    expect(request.url).toBe(`${deploymentUrl}/future-operation`);
    expect(request.headers.get('accept')).toBe(
      'application/vnd.amazon.eventstream'
    );
  });

  it.each([
    `${placeholderBaseUrl}/v1/files`,
    `${placeholderBaseUrl}/model/${model}`,
    'https://other.example/model/test/invoke'
  ])('rejects requests outside the model operation prefix: %s', async url => {
    const client = new SapAnthropicBedrockInvoke({
      anthropicConfig: {
        fetch,
        maxRetries: 0,
        middleware: [async (request, next) => next({ ...request, url })]
      }
    });
    await expect(client.messages.create(params)).rejects.toThrow(
      'Unsupported SAP AI Core Bedrock request path:'
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('propagates upstream HTTP errors', async () => {
    fetch.mockImplementation(async () =>
      Response.json(
        {
          type: 'error',
          error: { type: 'invalid_request_error', message: 'Bad request' }
        },
        { status: 400 }
      )
    );
    const client = createClient();
    await expect(client.messages.create(params)).rejects.toMatchObject({
      status: 400
    });
  });

  it('propagates model errors from binary stream chunks', async () => {
    fetch.mockImplementation(async () =>
      createBinaryResponse([
        ...events.slice(0, 3),
        {
          type: 'error',
          error: { type: 'overloaded_error', message: 'Claude stream failed' }
        }
      ])
    );
    const client = createClient();
    await expect(
      client.messages.stream(params).finalMessage()
    ).rejects.toBeInstanceOf(APIError);
  });

  it('fails before sending inference when destination authentication is missing', async () => {
    const destination = getMockedAiCoreDestination();
    const client = createClient(destination);
    destination.authTokens = [];
    await expect(client.messages.create(params)).rejects.toThrow(
      'Could not retrieve an authentication token from the AI Core destination.'
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('preserves the cause of a destination authentication error', async () => {
    const destination = getMockedAiCoreDestination();
    const client = createClient(destination);
    destination.authTokens![0].error = 'Token retrieval failed';
    await expect(client.messages.create(params)).rejects.toMatchObject({
      cause: expect.objectContaining({ message: 'Token retrieval failed' })
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});
