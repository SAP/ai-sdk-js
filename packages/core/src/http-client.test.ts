import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  mockDestination
} from '../../../test-util/mock-http.js';
import { executeRequest, getTargetUrl } from './http-client.js';

describe('http-client', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('adds ai-client-type header', async () => {
    const scope = nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-client-type': 'AI SDK JavaScript'
      }
    })
      .post('/v2/some/endpoint')
      .reply(200);

    await executeRequest({ url: '/some/endpoint' }, { prompt: 'test' });
    expect(scope.isDone()).toBe(true);
  });

  it('adds ai-client-type header, when there is a custom ai-client-type header', async () => {
    const scope = nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-client-type': /.*AI SDK JavaScript.*/
      }
    })
      .post('/v2/some/endpoint')
      .reply(200);

    await executeRequest(
      { url: '/some/endpoint' },
      { prompt: 'test' },
      { headers: { 'ai-client-type': 'custom client' } }
    );
    expect(scope.isDone()).toBe(true);
  });

  it('should execute a request to the AI Core service', async () => {
    const mockPrompt = { prompt: 'some test prompt' };
    const mockPromptResponse = { completion: 'some test completion' };

    const scope = nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-resource-group': 'default',
        'ai-client-type': 'AI SDK JavaScript'
      }
    })
      .post('/v2/some/endpoint', mockPrompt)
      .query({ 'api-version': 'mock-api-version' })
      .reply(200, mockPromptResponse);

    const res = await executeRequest(
      { url: '/some/endpoint', apiVersion: 'mock-api-version' },
      mockPrompt
    );
    expect(scope.isDone()).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockPromptResponse);
  });

  it('should execute a request to the AI Core service with a custom resource group', async () => {
    const mockPrompt = { prompt: 'some test prompt' };
    const mockPromptResponse = { completion: 'some test completion' };

    const scope = nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-resource-group': 'custom-resource-group',
        'ai-client-type': 'AI SDK JavaScript'
      }
    })
      .post('/v2/some/endpoint', mockPrompt)
      .query({ 'api-version': 'mock-api-version' })
      .reply(200, mockPromptResponse);

    const res = await executeRequest(
      {
        url: '/some/endpoint',
        apiVersion: 'mock-api-version',
        resourceGroup: 'custom-resource-group'
      },
      mockPrompt
    );
    expect(scope.isDone()).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockPromptResponse);
  });

  it('should execute a request using custom destination', async () => {
    mockDestination();

    const mockPrompt = { prompt: 'some test prompt' };
    const mockPromptResponse = { completion: 'some test completion' };

    const scope = nock('http://example.com', {
      reqheaders: {
        'ai-resource-group': 'default',
        'ai-client-type': 'AI SDK JavaScript'
      }
    })
      .post('/v2/some/endpoint', mockPrompt)
      .query({ 'api-version': 'mock-api-version' })
      .reply(200, mockPromptResponse);

    const res = await executeRequest(
      { url: '/some/endpoint', apiVersion: 'mock-api-version' },
      mockPrompt,
      {},
      {
        destinationName: 'aicore'
      }
    );
    expect(scope.isDone()).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockPromptResponse);
  });

  it('should get correct target url', async () => {
    expect(getTargetUrl('http://example.com', '/some/endpoint')).toBe(
      'http://example.com/v2/some/endpoint'
    );
    expect(getTargetUrl('http://example.com/', '/some/endpoint')).toBe(
      'http://example.com/v2/some/endpoint'
    );
    expect(getTargetUrl('http://example.com/abc', '/some/endpoint')).toBe(
      'http://example.com/abc/some/endpoint'
    );
    expect(getTargetUrl('http://example.com/abc/', '/some/endpoint')).toBe(
      'http://example.com/abc/some/endpoint'
    );
  });
});
