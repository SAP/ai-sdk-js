import { expectError, expectType, expectAssignable } from 'tsd';
import {
  OrchestrationEmbeddingClient,
  buildDpiMaskingProvider
} from '@sap-ai-sdk/orchestration';
import type {
  OrchestrationEmbeddingResponse,
  EmbeddingData,
  EmbeddingModelDetails
} from '@sap-ai-sdk/orchestration';
import type {
  EmbeddingsUsage,
  ModuleResultsBase
} from '@sap-ai-sdk/orchestration/internal.js';

/**
 * Basic Embedding Client Construction.
 */
expectType<OrchestrationEmbeddingClient>(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002'
      }
    }
  })
);

expectType<OrchestrationEmbeddingClient>(
  new OrchestrationEmbeddingClient(
    {
      embeddings: {
        model: {
          name: 'text-embedding-ada-002'
        }
      }
    },
    { deploymentId: 'deployment-123' }
  )
);

expectType<OrchestrationEmbeddingClient>(
  new OrchestrationEmbeddingClient(
    {
      embeddings: {
        model: {
          name: 'text-embedding-ada-002'
        }
      }
    },
    { resourceGroup: 'my-resource-group' }
  )
);

expectType<OrchestrationEmbeddingClient>(
  new OrchestrationEmbeddingClient(
    {
      embeddings: {
        model: {
          name: 'text-embedding-ada-002'
        }
      }
    },
    { deploymentId: 'deployment-123' },
    { destinationName: 'my-destination' }
  )
);

/**
 * Generate Embeddings.
 */
expectType<Promise<OrchestrationEmbeddingResponse>>(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002'
      }
    }
  }).embed({
    input: 'Hello, world!'
  })
);

expectType<Promise<OrchestrationEmbeddingResponse>>(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002'
      }
    }
  }).embed({
    input: ['Text 1', 'Text 2', 'Text 3']
  })
);

expectType<Promise<OrchestrationEmbeddingResponse>>(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002'
      }
    }
  }).embed({
    input: 'Query text',
    type: 'query'
  })
);

expectType<Promise<OrchestrationEmbeddingResponse>>(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002'
      }
    }
  }).embed(
    {
      input: 'Text to embed'
    },
    {
      params: {
        apiVersion: '2024-02-01'
      }
    }
  )
);

expectType<EmbeddingData[]>(
  (
    await new OrchestrationEmbeddingClient({
      embeddings: {
        model: {
          name: 'text-embedding-ada-002'
        }
      }
    }).embed({
      input: 'Test text'
    })
  ).getEmbeddings()
);

expectType<EmbeddingsUsage>(
  (
    await new OrchestrationEmbeddingClient({
      embeddings: {
        model: {
          name: 'text-embedding-ada-002'
        }
      }
    }).embed({
      input: 'Test text'
    })
  ).getTokenUsage()
);

expectType<ModuleResultsBase | undefined>(
  (
    await new OrchestrationEmbeddingClient({
      embeddings: {
        model: {
          name: 'text-embedding-ada-002'
        }
      }
    }).embed({
      input: 'Test text'
    })
  ).getIntermediateResults()
);

expectType<Promise<OrchestrationEmbeddingResponse>>(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002',
        params: {
          dimensions: 1536
        }
      }
    }
  }).embed({
    input: 'Text with model params'
  })
);

/**
 * Embedding Client with masking module.
 */
expectType<Promise<OrchestrationEmbeddingResponse>>(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002'
      }
    },
    masking: {
      masking_providers: [
        buildDpiMaskingProvider({
          method: 'anonymization',
          entities: ['profile-address'],
          allowlist: ['SAP'],
          mask_grounding_input: false
        })
      ]
    }
  }).embed({
    input: 'Text with sensitive data'
  })
);

expectAssignable<EmbeddingData>({
  object: 'embedding',
  embedding: [0.1, 0.2, 0.3],
  index: 0
});

expectAssignable<EmbeddingData>({
  object: 'embedding',
  embedding: 'base64encodedstring',
  index: 1
});

expectAssignable<EmbeddingModelDetails>({
  name: 'text-embedding-ada-002'
});

expectAssignable<EmbeddingModelDetails>({
  name: 'text-embedding-ada-002',
  params: {
    dimensions: 1536
  }
});

/**
 * Error: Empty embedding configuration should fail.
 */
expectError(new OrchestrationEmbeddingClient({}));

/**
 * Error: Missing model name should fail.
 */
expectError(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        params: { dimensions: 1536 }
      }
    }
  })
);

/**
 * Error: Invalid input type should fail.
 */
expectError(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002'
      }
    }
  }).embed({
    input: 'Test text',
    type: 'invalid-type'
  })
);

/**
 * Error: Missing input should fail.
 */
expectError(
  new OrchestrationEmbeddingClient({
    embeddings: {
      model: {
        name: 'text-embedding-ada-002'
      }
    }
  }).embed({})
);

/**
 * Error: Invalid embedding object type should fail.
 */
expectError<EmbeddingData>({
  object: 'invalid-object',
  embedding: [0.1, 0.2],
  index: 0
});
