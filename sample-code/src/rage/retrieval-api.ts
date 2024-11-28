import { RetrievalFederatedSearchAcrossDataRepositoriesApi } from '@sap-ai-sdk/rage';
import type { SearchResults } from '@sap-ai-sdk/rage';

/**
 * Search for documents in a collection.
 * @param collectionId - The ID of the collection to search.
 * @param query - The query to search for.
 * @param resourceGroup - The resource group to use for the search.
 * @returns The search results.
 */
export async function searchCollection(
  collectionId: string,
  query: string,
  resourceGroup: string
): Promise<SearchResults> {
  return RetrievalFederatedSearchAcrossDataRepositoriesApi.retrievalV1RetrievalEndpointsSearchDataRepositories(
    {
      query,
      filters: [
        {
          id: collectionId,
          dataRepositoryType: 'vector',
          dataRepositories: [collectionId]
        }
      ]
    },
    { 'AI-Resource-Group': resourceGroup }
  ).execute();
}
