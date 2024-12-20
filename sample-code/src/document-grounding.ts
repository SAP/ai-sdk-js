import { RetrievalApi, VectorApi } from '@sap-ai-sdk/document-grounding';
import type {
  DocumentsListResponse,
  RetievalSearchResults
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
        modelName: 'text-embedding-ada-002-v2'
      },
      metadata: []
    },
    {
      'AI-Resource-Group': 'default'
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
    'AI-Resource-Group': 'default'
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
              metadata: []
            }
          ]
        }
      ]
    },
    {
      'AI-Resource-Group': 'default'
    }
  ).execute();
}

/**
 * Retrieve documents across data repositories.
 * @returns Search results.
 */
export async function retrieveDocuments(): Promise<RetievalSearchResults> {
  return RetrievalApi.search(
    {
      query:
        'When was the last time SAP AI SDK JavaScript end to end test was executed?',
      filters: [
        {
          id: 'my-filter',
          searchConfiguration: {
            maxChunkCount: 10
          },
          dataRepositories: ['*'],
          dataRepositoryType: 'vector',
          dataRepositoryMetadata: [],
          documentMetadata: [],
          chunkMetadata: []
        }
      ]
    },
    {
      'AI-Resource-Group': 'default'
    }
  ).execute();
}
