import { VectorApi } from '@sap-ai-sdk/rage';
/**
 * Create a new collection.
 * @param resourceGroup - The resource group name.
 * @param title - The title of the collection to create.
 * @returns The response of the create collection request.
 */
export async function createCollection(
  resourceGroup: string,
  title: string
): Promise<any> {
  const response =
    VectorApi.CollectionsApi.vectorV1VectorEndpointsCreateCollection(
      {
        title,
        embeddingConfig: {
          modelName: 'text-embedding-ada-002-v2'
        },
        metadata: [
          {
            key: 'purpose',
            value: ['grounding test']
          }
        ]
      },
      { 'AI-Resource-Group': resourceGroup }
    ).execute();
  return response;
}
