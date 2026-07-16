import nock from 'nock';
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach
} from '@jest/globals';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  mockDeploymentsList
} from '../../../../test-util/mock-http.js';

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  readonly url: string;
  readonly options: { headers?: Record<string, string> };
  readonly sent: string[] = [];
  closed: { code: number; reason: string } | undefined;

  private readonly listeners: Record<string, ((...args: any[]) => void)[]> = {};

  constructor(
    url: string,
    _protocols: unknown,
    options: { headers?: Record<string, string> } = {}
  ) {
    this.url = url;
    this.options = options;
    MockWebSocket.instances.push(this);
  }

  on(event: string, cb: (...args: any[]) => void): this {
    (this.listeners[event] ??= []).push(cb);
    return this;
  }

  send(data: string): void {
    this.sent.push(data);
  }

  close(code: number, reason: string): void {
    this.closed = { code, reason };
  }

  receive(event: unknown): void {
    this.receiveRaw(Buffer.from(JSON.stringify(event)));
  }

  receiveRaw(raw: Buffer): void {
    (this.listeners.message ?? []).forEach(cb => cb(raw));
  }

  fail(error: Error): void {
    (this.listeners.error ?? []).forEach(cb => cb(error));
  }
}

jest.unstable_mockModule('ws', () => ({
  __esModule: true,
  default: MockWebSocket
}));

const { SapOpenAiRealtime } = await import('./realtime-client.js');

const defaultDeployment = {
  id: 'dep-realtime',
  model: { name: 'gpt-realtime', version: 'latest' },
  deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-realtime`
};

describe('SapOpenAiRealtime', () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    mockClientCredentialsGrantCall();
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'azure-openai' },
      defaultDeployment
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('opens a wss connection to /v1/realtime with SAP headers', async () => {
    const client = await SapOpenAiRealtime.createClient('gpt-realtime');

    expect(client.url.toString()).toBe(
      'wss://api.ai.ml.hana.ondemand.com/v2/inference/deployments/dep-realtime/v1/realtime'
    );
    const socket = MockWebSocket.instances[0];
    expect(socket.url).toBe(client.url.toString());
    expect(socket.options.headers).toMatchObject({
      Authorization: expect.stringMatching(/^Bearer /),
      'AI-Resource-Group': 'default',
      'AI-Client-Type': 'AI SDK JavaScript'
    });
  });

  it('appends a custom client type to the AI-Client-Type header', async () => {
    const client = await SapOpenAiRealtime.createClient({
      deployment: 'gpt-realtime',
      clientType: 'my-app'
    });

    const socket = MockWebSocket.instances[0];
    expect(socket.options.headers?.['AI-Client-Type']).toBe(
      'AI SDK JavaScript,my-app'
    );
    expect(client).toBeInstanceOf(SapOpenAiRealtime);
  });

  it('resolves a deployment with a custom resource group', async () => {
    nock.cleanAll();
    mockClientCredentialsGrantCall();
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'azure-openai',
        resourceGroup: 'my-rg'
      },
      defaultDeployment
    );

    await SapOpenAiRealtime.createClient({
      deployment: { modelName: 'gpt-realtime', resourceGroup: 'my-rg' }
    });

    expect(
      MockWebSocket.instances[0].options.headers?.['AI-Resource-Group']
    ).toBe('my-rg');
  });

  it('serializes sent events to JSON', async () => {
    const client = await SapOpenAiRealtime.createClient('gpt-realtime');

    client.send({ type: 'response.create' });

    expect(MockWebSocket.instances[0].sent).toEqual([
      JSON.stringify({ type: 'response.create' })
    ]);
  });

  it('re-emits incoming messages as typed and generic events', async () => {
    const client = await SapOpenAiRealtime.createClient('gpt-realtime');
    const socket = MockWebSocket.instances[0];

    const genericEvents: unknown[] = [];
    const sessionCreated: unknown[] = [];
    client.on('event', e => genericEvents.push(e));
    client.on('session.created', e => sessionCreated.push(e));

    const event = { type: 'session.created', event_id: 'evt_1', session: {} };
    socket.receive(event);

    expect(genericEvents).toEqual([event]);
    expect(sessionCreated).toEqual([event]);
  });

  it('routes server error events through the error listener', async () => {
    const client = await SapOpenAiRealtime.createClient('gpt-realtime');
    const socket = MockWebSocket.instances[0];

    const errors: { message: string }[] = [];
    client.on('error', e => errors.push(e));

    socket.receive({
      type: 'error',
      event_id: 'evt_err',
      error: { message: 'boom', code: 'bad', type: 'invalid_request_error' }
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('boom');
  });

  it('routes transport errors through the error listener', async () => {
    const client = await SapOpenAiRealtime.createClient('gpt-realtime');
    const socket = MockWebSocket.instances[0];

    const errors: { message: string }[] = [];
    client.on('error', e => errors.push(e));

    socket.fail(new Error('socket exploded'));

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('socket exploded');
  });

  it('emits an error when an invalid message frame is received', async () => {
    const client = await SapOpenAiRealtime.createClient('gpt-realtime');
    const socket = MockWebSocket.instances[0];

    const errors: { message: string }[] = [];
    client.on('error', e => errors.push(e));

    socket.receiveRaw(Buffer.from('not-json'));

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('could not parse websocket event');
  });

  it('closes the socket with the provided code and reason', async () => {
    const client = await SapOpenAiRealtime.createClient('gpt-realtime');

    client.close({ code: 4000, reason: 'bye' });

    expect(MockWebSocket.instances[0].closed).toEqual({
      code: 4000,
      reason: 'bye'
    });
  });

  it('closes the socket with defaults when no props are given', async () => {
    const client = await SapOpenAiRealtime.createClient('gpt-realtime');

    client.close();

    expect(MockWebSocket.instances[0].closed).toEqual({
      code: 1000,
      reason: 'OK'
    });
  });
});
