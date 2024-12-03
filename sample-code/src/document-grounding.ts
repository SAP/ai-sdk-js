import { CollectionsApi, DocumentsApi } from '@sap-ai-sdk/document-grounding';
import type { DocumentsListResponse } from '@sap-ai-sdk/document-grounding';

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
 * Create documents.
 * @param collectionId - Collection ID.
 * @param secret - Secret.
 * @returns Documents creation response.
 */
export async function createDocumentsWithSecret(
  collectionId: string,
  secret: number
): Promise<DocumentsListResponse> {
  return DocumentsApi.vectorV1VectorEndpointsCreateDocuments(
    collectionId,
    {
      documents: [
        {
          metadata: [],
          chunks: [
            {
              content: `SAP AI SDK JavaScript end to end test needs a secret number to pass. The secret is '${secret}'.`,
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
