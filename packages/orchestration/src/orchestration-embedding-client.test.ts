import nock from 'nock';
import { jest } from '@jest/globals';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseFileToString,
  parseMockResponse
} from '../../../test-util/mock-http.js';
import { buildDpiMaskingProvider } from './util/masking.js';
import { OrchestrationEmbeddingClient } from './orchestration-embedding-client.js';
import { OrchestrationEmbeddingResponse } from './orchestration-embedding-response.js';
import { constructEmbeddingPostRequest } from './util/module-config.js';
import type { EmbeddingsPostResponse } from './client/api/schema/index.js';
import type {
  EmbeddingModuleConfig,
  EmbeddingRequest
} from './orchestration-types.js';

describe('orchestration embedding service client', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList({ scenarioId: 'orchestration' }, { id: '1234' });
  });

  afterEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  it('calls embed with minimal configuration', async () => {
    const config: EmbeddingModuleConfig = {
      embeddings: {
        model: {
          name: 'text-embedding-3-small',
          params: {
            dimensions: 4,
            encoding_format: 'float'
          }
        }
      }
    };

    const request: EmbeddingRequest = {
      input: 'Test text for embedding'
    };

    const mockResponse = await parseMockResponse<EmbeddingsPostResponse>(
      'orchestration',
      'orchestration-embedding-simple-response.json'
    );

    mockInference(
      {
        data: constructEmbeddingPostRequest(config, request)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/embeddings'
      }
    );

    const response = await new OrchestrationEmbeddingClient(config).embed(
      request
    );

    expect(response).toBeInstanceOf(OrchestrationEmbeddingResponse);
    expect(response._data.request_id).toBe('random-request-id');
    expect(response._data.final_result.model).toBe('text-embedding-3-small');
    expect(response.getEmbeddings().map(item => item.embedding)).toEqual(
      expect.any(Array)
    );
    expect(response.getTokenUsage().prompt_tokens).toEqual(expect.any(Number));
  });

  it('calls embed with array input', async () => {
    const config: EmbeddingModuleConfig = {
      embeddings: {
        model: {
          name: 'text-embedding-3-small'
        }
      }
    };

    const request: EmbeddingRequest = {
      input: ['Text 1', 'Text 2', 'Text 3']
    };

    const mockResponse = await parseMockResponse<EmbeddingsPostResponse>(
      'orchestration',
      'orchestration-embedding-simple-response.json'
    );

    mockInference(
      {
        data: constructEmbeddingPostRequest(config, request)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/embeddings'
      }
    );

    const response = await new OrchestrationEmbeddingClient(config).embed(
      request
    );

    expect(response).toBeInstanceOf(OrchestrationEmbeddingResponse);
    expect(response._data.request_id).toBe('random-request-id');
    expect(response.getEmbeddings().map(item => item.embedding)).toEqual(
      expect.any(Array)
    );
  });

  it('calls embed with input type specification', async () => {
    const config: EmbeddingModuleConfig = {
      embeddings: {
        model: {
          name: 'text-embedding-3-small',
          version: 'latest'
        }
      }
    };

    const request: EmbeddingRequest = {
      input: 'Test text for embedding',
      type: 'query'
    };

    const mockResponse = await parseMockResponse<EmbeddingsPostResponse>(
      'orchestration',
      'orchestration-embedding-simple-response.json'
    );

    mockInference(
      {
        data: constructEmbeddingPostRequest(config, request)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/embeddings'
      }
    );

    const response = await new OrchestrationEmbeddingClient(config).embed(
      request
    );

    expect(response).toBeInstanceOf(OrchestrationEmbeddingResponse);
    expect(response._data.request_id).toBe('random-request-id');
    expect(response.getEmbeddings().map(item => item.embedding)).toEqual(
      expect.any(Array)
    );
  });

  it('calls embed with masking configuration', async () => {
    const config: EmbeddingModuleConfig = {
      embeddings: {
        model: {
          name: 'text-embedding-3-small',
          params: {
            dimensions: 1536
          }
        }
      },
      masking: {
        masking_providers: [
          buildDpiMaskingProvider({
            method: 'pseudonymization',
            entities: ['profile-person', 'profile-location']
          })
        ]
      }
    };

    const request: EmbeddingRequest = {
      input:
        'My name is Tom. I am applying as a Senior Software Dev. I work closely with Jerry.'
    };

    const mockResponse = await parseMockResponse<EmbeddingsPostResponse>(
      'orchestration',
      'orchestration-embedding-with-masking-response.json'
    );

    mockInference(
      {
        data: constructEmbeddingPostRequest(config, request)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/embeddings'
      }
    );

    const response = await new OrchestrationEmbeddingClient(config).embed(
      request
    );

    expect(response).toBeInstanceOf(OrchestrationEmbeddingResponse);
    expect(response._data.request_id).toBe('random-request-id');
    expect(response.getIntermediateResults()).toBeDefined();
    expect(response.getIntermediateResults()?.input_masking).toBeDefined();
    expect(
      response.getIntermediateResults()?.input_masking?.data?.masked_input
    ).toContain(
      'My name is MASKED_PERSON. I am applying as a Senior Software Dev. I work closely with MASKED_PERSON.'
    );
    expect(response.getEmbeddings().map(item => item.embedding)).toEqual(
      expect.any(Array)
    );
  });

  it('executes a request with the custom resource group', async () => {
    const config: EmbeddingModuleConfig = {
      embeddings: {
        model: {
          name: 'text-embedding-3-small'
        }
      }
    };

    const request: EmbeddingRequest = {
      input: 'Test text for embedding with custom resource group'
    };

    const customEmbeddingEndpoint = {
      url: 'inference/deployments/1234/v2/embeddings',
      resourceGroup: 'custom-resource-group'
    };

    const mockResponse = await parseMockResponse<EmbeddingsPostResponse>(
      'orchestration',
      'orchestration-embedding-with-masking-response.json'
    );

    mockDeploymentsList(
      { scenarioId: 'orchestration', resourceGroup: 'custom-resource-group' },
      {
        id: '1234',
        model: { name: 'text-embedding-3-small', version: 'latest' }
      }
    );

    mockInference(
      {
        data: constructEmbeddingPostRequest(config, request)
      },
      {
        data: mockResponse,
        status: 200
      },
      customEmbeddingEndpoint
    );

    const clientWithResourceGroup = new OrchestrationEmbeddingClient(config, {
      resourceGroup: 'custom-resource-group'
    });

    const response = await clientWithResourceGroup.embed(request);
    expect(response).toBeInstanceOf(OrchestrationEmbeddingResponse);
    expect(response._data.request_id).toBe('random-request-id');
  });

  it('handles orchestration service error responses with detailed error messages', async () => {
    const config: EmbeddingModuleConfig = {
      embeddings: {
        model: {
          name: 'text-embedding-3'
        }
      }
    };

    const request: EmbeddingRequest = {
      input: 'Test text for embedding'
    };

    const mockResponse = await parseFileToString(
      'orchestration',
      'orchestration-embedding-error.json'
    );

    mockInference(
      {
        data: constructEmbeddingPostRequest(config, request)
      },
      {
        data: mockResponse,
        status: 400
      },
      {
        url: 'inference/deployments/1234/v2/embeddings'
      }
    );

    try {
      await new OrchestrationEmbeddingClient(config).embed(request);
      fail('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.cause?.response?.data?.error).toMatchSnapshot();
    }
  });
});
