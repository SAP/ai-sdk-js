---
'@sap-ai-sdk/orchestration': patch
---

[Compatibility Note] The `ModuleResults` and `LlmModuleResult` types are now only meant to be used for the non-streaming case.
Previously, they represented both streaming and non-streaming response.
For streaming, use `ModuleResultsStreaming` and `LlmModuleResultStreaming` types instead.
