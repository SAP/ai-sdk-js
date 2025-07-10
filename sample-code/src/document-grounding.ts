import {
  VectorApi,
  RetrievalApi,
  PipelinesApi
} from '@sap-ai-sdk/document-grounding';
import type {
  DataRepositoryType,
  DocumentsListResponse,
  GetPipelineStatus,
  RetrievalSearchResults
} from '@sap-ai-sdk/document-grounding';

/**
 * Create a collection.
 * @returns Collection creation response.
 */
export async function createCollection(): Promise<string> {
  const createCollectionResponse = await VectorApi.createCollection(
    {
      title: 'ai-sdk-js-e2e',
      embeddingConfig: {
        modelName: 'text-embedding-3-small'
      },
      metadata: []
    },
    {
      'AI-Resource-Group': 'ai-sdk-js-e2e'
    }
  ).executeRaw();

  return (createCollectionResponse.headers.location as string)
    .split('/')
    .at(-2)!;
}

/**
 * Delete a collection.
 * @param collectionId - Collection ID.
 * @returns Collection deletion response.
 */
export async function deleteCollection(collectionId: string): Promise<any> {
  return VectorApi.deleteCollectionById(collectionId, {
    'AI-Resource-Group': 'ai-sdk-js-e2e'
  }).execute();
}

/**
 * Create document with a timestamp in it.
 * @param collectionId - Collection ID.
 * @param timestamp - Timestamp at which e2e was executed.
 * @returns Documents creation response.
 */
export async function createDocumentsWithTimestamp(
  collectionId: string,
  timestamp: number
): Promise<DocumentsListResponse> {
  return VectorApi.createDocuments(
    collectionId,
    {
      documents: [
        {
          metadata: [],
          chunks: [
            {
              content: `The last SAP AI SDK JavaScript end to end test was run at ${timestamp}.`,
              metadata: [
                {
                  key: 'context',
                  value: ['sap-ai-sdk-js']
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'AI-Resource-Group': 'ai-sdk-js-e2e'
    }
  ).execute();
}

/**
 * Retrieve documents across data repositories.
 * @param query - Search query.
 * @param dataRepositoryType - Type of data repository.
 * @param dataRepositories - List of data repositories to search in.
 * @returns Search results.
 */
export async function retrieveDocuments(
  query: string,
  dataRepositoryType: DataRepositoryType = 'vector',
  dataRepositories: string[] = ['*']
): Promise<RetrievalSearchResults> {
  return RetrievalApi.search(
    {
      query,
      filters: [
        {
          id: 'my-filter',
          searchConfiguration: {
            maxChunkCount: 10
          },
          dataRepositories,
          dataRepositoryType
        }
      ]
    },
    {
      'AI-Resource-Group': 'ai-sdk-js-e2e'
    }
  ).execute();
}

/**
 * Get pipeline status.
 * @param pipelineId - Pipeline ID.
 * @returns Pipeline status.
 */
export async function getPipelineStatus(
  pipelineId: string
): Promise<GetPipelineStatus> {
  return PipelinesApi.getPipelineStatus(pipelineId, {
    'AI-Resource-Group': 'ai-sdk-js-e2e'
  }).execute();
}
