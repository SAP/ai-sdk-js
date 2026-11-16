import { resolveDeploymentUrlForModel } from '@sap-ai-sdk/ai-api/internal.js';
import { getAiCoreDestination } from '@sap-ai-sdk/core';

import { APIError } from '@anthropic-ai/sdk';
import { EventStreamCodec } from '@smithy/core/event-streams';

import { SapAnthropicBedrockInvoke } from './client.ts';

import type * as AiApi from '@sap-ai-sdk/ai-api/internal.js';

import type { MessageStreamEvent } from '@anthropic-ai/sdk/resources/messages';

vi.mock('@sap-ai-sdk/ai-api/internal.js', async importOriginal => ({
  ...(await importOriginal<typeof AiApi>()),
  resolveDeploymentUrlForModel: vi.fn<typeof resolveDeploymentUrlForModel>()
}));

vi.mock('@sap-ai-sdk/core', () => ({
  getAiCoreDestination: vi.fn<typeof getAiCoreDestination>()
}));

const deploymentUrl =
  'https://api.ai.example/v2/inference/deployments/deployment-123';
const model = 'anthropic--claude-4.6-sonnet';
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
    vi.mocked(resolveDeploymentUrlForModel).mockResolvedValue(deploymentUrl);
    vi.mocked(getAiCoreDestination).mockResolvedValue({
      url: 'https://api.ai.example',
      authTokens: [
        {
          type: 'Bearer',
          value: 'sap-token',
          error: null,
          http_header: { key: 'Authorization', value: 'Bearer sap-token' }
        }
      ]
    });
    fetch.mockReset();
    fetch.mockImplementation(async () => Response.json(message));
  });

  async function createClient(): Promise<SapAnthropicBedrockInvoke> {
    return SapAnthropicBedrockInvoke.createClient({
      deployment: { modelName: model, resourceGroup: 'custom-rg' },
      clientType: 'test-app',
      anthropicConfig: { fetch, maxRetries: 0 }
    });
  }

  it('resolves a bare model name through the Bedrock executable', async () => {
    await SapAnthropicBedrockInvoke.createClient(model);
    expect(resolveDeploymentUrlForModel).toHaveBeenCalledWith(model, {
      scenarioId: 'foundation-models',
      executableId: 'aws-bedrock',
      resourceGroup: 'default',
      destination: undefined
    });
  });

  it('forwards deployment ID, resource group, and custom destination', async () => {
    const destination = { url: 'https://custom.ai.example' };
    const deployment = {
      deploymentId: 'deployment-123',
      resourceGroup: 'custom-rg'
    };
    const client = await SapAnthropicBedrockInvoke.createClient({
      deployment,
      destination,
      anthropicConfig: { fetch, maxRetries: 0 }
    });
    await client.messages.create(params);
    expect(resolveDeploymentUrlForModel).toHaveBeenCalledWith(deployment, {
      scenarioId: 'foundation-models',
      executableId: 'aws-bedrock',
      resourceGroup: 'custom-rg',
      destination
    });
    expect(getAiCoreDestination).toHaveBeenCalledWith(destination);
  });

  it('uses Invoke with upstream payload adaptation and SAP headers', async () => {
    const client = await createClient();
    expect(await client.messages.create(params)).toEqual(message);
    const [url, init] = fetch.mock.calls[0];
    const request = new Request(url, init);
    expect(request.url).toBe(`${deploymentUrl}/invoke`);
    expect(await request.json()).toEqual({
      max_tokens: 32,
      messages: params.messages,
      anthropic_version: 'bedrock-2023-05-31'
    });
    expect(request.headers.get('authorization')).toBe('Bearer sap-token');
    expect(request.headers.get('ai-resource-group')).toBe('custom-rg');
    expect(request.headers.get('ai-client-type')).toBe(
      'AI SDK JavaScript,test-app'
    );
    expect(request.headers.has('x-api-key')).toBe(false);
    expect(request.headers.has('x-amz-date')).toBe(false);
  });

  it('resolves destination tokens for every request', async () => {
    const client = await createClient();
    await client.messages.create(params);
    vi.mocked(getAiCoreDestination).mockResolvedValue({
      url: 'https://api.ai.example',
      authTokens: [
        {
          type: 'Bearer',
          value: 'refreshed-token',
          error: null,
          http_header: { key: 'Authorization', value: 'Bearer refreshed-token' }
        }
      ]
    });
    await client.messages.create(params);
    const [url, init] = fetch.mock.calls[1];
    expect(new Request(url, init).headers.get('authorization')).toBe(
      'Bearer refreshed-token'
    );
    expect(getAiCoreDestination).toHaveBeenCalledTimes(2);
  });

  it('decodes fragmented binary streams with native text and message helpers', async () => {
    fetch.mockImplementation(async () => createBinaryResponse(events));
    const client = await createClient();
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
    const client = await createClient();
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
    const client = (await createClient()).withOptions({ timeout: 1000 });
    expect(client.timeout).toBe(1000);
    await client.messages.create(params);
    const [url, init] = fetch.mock.calls[0];
    expect(new Request(url, init).headers.get('ai-resource-group')).toBe(
      'custom-rg'
    );
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
    const client = await createClient();
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
    const client = await createClient();
    await expect(
      client.messages.stream(params).finalMessage()
    ).rejects.toBeInstanceOf(APIError);
  });

  it('fails before sending inference when destination authentication is missing', async () => {
    vi.mocked(getAiCoreDestination).mockResolvedValue({
      url: 'https://api.ai.example'
    });
    const client = await createClient();
    await expect(client.messages.create(params)).rejects.toThrow(
      'Could not retrieve an authentication token from the AI Core destination.'
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});
