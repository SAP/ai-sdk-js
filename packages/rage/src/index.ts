export * from './client/pipeline/pipeline-api/index.js';
export {
  CollectionsApi,
  DocumentsApi,
  SearchApi,
  SearchResults as VectorSearchResults,
  Collection,
  DocumentsListResponse
} from './client/vector/vector-api/index.js';
export {
  RetrievalFederatedSearchAcrossDataRepositoriesApi,
  RetrievalDataRepositoryApi,
  SearchResults as RetrievalSearchResults
} from './client/retrieval/retrieval-api/index.js';
