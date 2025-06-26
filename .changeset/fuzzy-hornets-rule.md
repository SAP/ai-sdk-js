---
'@sap-ai-sdk/orchestration': patch
---

[Compatibility Note] The `ModuleResults` and `LlmModuleResult` types are now only meant to be used for the non-streaming case. For streaming, use `ModuleResultsStreaming` and `LlmModuleResultStreaming` types instead. Previously, the types represented both streaming and non-streaming response.
