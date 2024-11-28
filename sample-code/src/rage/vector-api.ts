import { CollectionsApi, DocumentsApi } from '@sap-ai-sdk/rage';
import type { Collection, DocumentsListResponse } from '@sap-ai-sdk/rage';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
/**
 * Create a new collection.
 * @param title - The title of the collection to create.
 * @param resourceGroup - The resource group name.
 * @returns The response of the create collection request.
 */
export async function createCollection(
  title: string,
  resourceGroup: string
): Promise<any> {
  const response: HttpResponse =
    await CollectionsApi.vectorV1VectorEndpointsCreateCollection(
      {
        title,
        embeddingConfig: {},
        metadata: []
      },
      { 'AI-Resource-Group': resourceGroup }
    ).executeRaw();
  if (response.headers) {
    const location: string = response.headers['location'];
    const match = location.match(/collections\/(.*?)\/creationStatus/);
    const id = match ? match[1] : null;
    if (id) {
      return { id };
    }
    throw new Error(
      `Collection could not be created, location header contains
      ${location}`
    );
  }
}

/**
 * Delete a collection.
 * @param collectionId - The collection ID to delete.
 * @param resourceGroup - The resource group name.
 * @returns The response of the delete collection request.
 */
export async function deleteCollection(
  collectionId: string,
  resourceGroup: string
): Promise<any> {
  const response = await CollectionsApi.vectorV1VectorEndpointsDeleteCollection(
    collectionId,
    { 'AI-Resource-Group': resourceGroup }
  ).execute();
  return response;
}

/**
 * Fetch a collection by ID.
 * @param collectionId - The collection ID to fetch.
 * @param resourceGroup - The resource group name.
 * @returns The fetched collection.
 */
export async function getCollection(
  collectionId: string,
  resourceGroup: string
): Promise<Collection> {
  return CollectionsApi.vectorV1VectorEndpointsGetCollectionById(collectionId, {
    'AI-Resource-Group': resourceGroup
  }).execute();
}

/**
 * Create a document in a collection.
 * @param collectionId - The collection ID.
 * @param resourceGroup - The resource group name.
 * @param content - The content of the document to add.
 * @returns Document list response.
 */
export async function createDocument(
  collectionId: string,
  resourceGroup: string,
  content: string
): Promise<DocumentsListResponse> {
  return DocumentsApi.vectorV1VectorEndpointsCreateDocuments(
    collectionId,
    {
      documents: [
        {
          chunks: [
            {
              content,
              metadata: []
            }
          ],
          metadata: []
        }
      ]
    },
    { 'AI-Resource-Group': resourceGroup }
  ).execute();
}
