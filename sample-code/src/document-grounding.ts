import { CollectionsApi, DocumentsApi, RetrievalFederatedSearchAcrossDataRepositoriesApi } from '@sap-ai-sdk/document-grounding';
import type { DocumentsListResponse, SearchResults } from '@sap-ai-sdk/document-grounding';

/**
 * Create a collection.
 * @returns Collection creation response.
 */
export async function createCollection(): Promise<string> {
  const createCollectionResponse =
    await CollectionsApi.vectorV1VectorEndpointsCreateCollection(
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
  return CollectionsApi.vectorV1VectorEndpointsDeleteCollection(collectionId, {
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
  return DocumentsApi.vectorV1VectorEndpointsCreateDocuments(
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
export async function retrieveDocuments(): Promise<SearchResults> {
  return RetrievalFederatedSearchAcrossDataRepositoriesApi.retrievalV1RetrievalEndpointsSearchDataRepositories(
    {
      query: 'When was the last time SAP AI SDK JavaScript end to end test was executed?',
      filters: [
        {
          id: 'my-filter',
          searchConfiguration: {
            maxChunkCount: 1
          },
          dataRepositories: [
            '*'
          ],
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
