---
'@sap-ai-sdk/document-grounding': minor
---

[Compatibility Note] Some types have been renamed to include endpoint-specific prefixes.
Some instances of the prior names may still exist:
- `SearchResults` was renamed to `VectorSearchResults` / `RetrievalSearchResults`
- `Chunk` was renamed to `VectorChunk` / `RetrievalChunk`
- `SearchFilter` was renamed to `VectorSearchFilter`
- `KeyValueListPair` was renamed to `VectorKeyValueListPair` / `RetrievalKeyValueListPair`
- `DocumentKeyValueListPair` was renamed to `VectorDocumentKeyValueListPair` / `RetrievalDocumentKeyValueListPair`
- `SearchConfiguration` was renamed to `VectorSearchConfiguration` / `RetrievalSearchConfiguration`
- `SearchSelectOptionEnum` was renamed to `VectorSearchSelectOptionEnum` / `RetrievalSearchSelectOptionEnum`
- `PerFilterSearchResult` was renamed to `RetrievalPerFilterSearchResult`
- `PerFilterSearchError` was renamed to `RetrievalPerFilterSearchError`
- `DataRepositorySearchResult` was renamed to `RetrievalDataRepositorySearchResult`
- `SearchInput` was renamed to `RetrievalSearchInput`