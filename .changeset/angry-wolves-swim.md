---
'@sap-ai-sdk/document-grounding': minor
---

[Compatibility Note] `DocumentKeyValueListPair`, `RetrievalDocumentKeyValueListPair`, `VectorDocumentKeyValueListPair`: the `matchMode` property type was narrowed from an open union (`'ANY' | 'ALL' | any`) to the strict `FilterMatchModeEnum` (`'ANY' | 'ALL'`).
