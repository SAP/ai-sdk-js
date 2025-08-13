---
'@sap-ai-sdk/langchain': patch
---

[Compatibility Note] Update imports to use new API facade from foundation-models package.
- Some generated types now need to be imported from `@sap-ai-sdk/foundation-models/internal.js` instead of `@sap-ai-sdk/foundation-models`.
- Update to use new `AzureOpenAiChatCompletionParameters` type to replace `AzureOpenAiCreateChatCompletionRequest` which is no longer exported publicly.
