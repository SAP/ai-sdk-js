import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination
} from '../../../test-util/mock-http.js';
import { OpenApiRequestBuilder } from './openapi-request-builder.js';

describe('OpenApiRequestBuilder', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should support custom request config with headers', async () => {
    const mockResponse = { completion: 'some test completion' };
    const mockRequest = { prompt: 'some test prompt' };

    const scope = nock(aiCoreDestination.url)
    .matchHeader('x-custom-header', 'custom-value')
      .post('/v2/some/endpoint', mockRequest)
      .query({ 'api-version': 'mock-api-version' })
      .reply(200, mockResponse);

    const builder = new OpenApiRequestBuilder(
      'post',
      '/some/endpoint',
      {
        queryParameters: { 'api-version': 'mock-api-version' },
        body: mockRequest
      }
    );

    const response = await builder.execute(undefined, {
      headers: {
        'x-custom-header': 'custom-value'
      }
    });

    expect(scope.isDone()).toBe(true);
    expect(response).toEqual(mockResponse);
  });

  it('should execute executeRaw with custom request config', async () => {
    const mockResponse = { completion: 'some test completion' };
    const mockRequest = { prompt: 'some test prompt' };

    const scope = nock(aiCoreDestination.url)
      .post('/v2/some/endpoint', mockRequest)
      .query({ 'api-version': 'mock-api-version' })
      .reply(200, mockResponse, {
        'x-custom-response-header': 'response-value'
      });

    const builder = new OpenApiRequestBuilder(
      'post',
      '/some/endpoint',
      {
        queryParameters: { 'api-version': 'mock-api-version' },
        body: mockRequest
      }
    );

    const response = await builder.executeRaw(undefined, {
      headers: {
        'x-billing-id': '12345'
      }
    });

    expect(scope.isDone()).toBe(true);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponse);
    expect(response.headers['x-custom-response-header']).toBe('response-value');
  });

  it('should execute without custom request config', async () => {
    const mockResponse = { completion: 'some test completion' };
    const mockRequest = { prompt: 'some test prompt' };

    const scope = nock(aiCoreDestination.url)
      .post('/v2/some/endpoint', mockRequest)
      .query({ 'api-version': 'mock-api-version' })
      .reply(200, mockResponse);

    const builder = new OpenApiRequestBuilder(
      'post',
      '/some/endpoint',
      {
        queryParameters: { 'api-version': 'mock-api-version' },
        body: mockRequest
      }
    );

    const response = await builder.execute();

    expect(scope.isDone()).toBe(true);
    expect(response).toEqual(mockResponse);
  });
});
